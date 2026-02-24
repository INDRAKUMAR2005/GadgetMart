package com.gadgetmart.order.service;

import com.gadgetmart.order.dto.OrderRequest;
import com.gadgetmart.order.event.OrderPlacedEvent;
import com.gadgetmart.order.model.Order;
import com.gadgetmart.order.model.OrderItem;
import com.gadgetmart.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    private static final String ORDER_PLACED_TOPIC = "order.placed";

    @Transactional
    public String placeOrder(OrderRequest orderRequest) {
        log.info("Processing order for user: {}", orderRequest.getUserEmail());

        List<OrderItem> orderItems = orderRequest.getItems().stream()
                .map(this::mapToEntity)
                .collect(Collectors.toList());

        BigDecimal totalAmount = orderItems.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Order order = Order.builder()
                .orderNumber(UUID.randomUUID().toString())
                .userEmail(orderRequest.getUserEmail())
                .orderItems(orderItems)
                .totalAmount(totalAmount)
                .status("PLACED")
                .createdAt(LocalDateTime.now())
                .build();

        orderRepository.save(order);
        log.info("Order {} placed successfully for {}", order.getOrderNumber(), order.getUserEmail());

        // 🚀 Publish Kafka event — triggers notification, inventory, analytics
        // downstream
        publishOrderPlacedEvent(order);

        return order.getOrderNumber();
    }

    private void publishOrderPlacedEvent(Order order) {
        try {
            List<OrderPlacedEvent.OrderItemEntry> eventItems = order.getOrderItems().stream()
                    .map(item -> OrderPlacedEvent.OrderItemEntry.builder()
                            .productName(item.getProductName())
                            .quantity(item.getQuantity())
                            .price(item.getPrice())
                            .build())
                    .collect(Collectors.toList());

            OrderPlacedEvent event = OrderPlacedEvent.builder()
                    .orderNumber(order.getOrderNumber())
                    .userEmail(order.getUserEmail())
                    .totalAmount(order.getTotalAmount())
                    .items(eventItems)
                    .build();

            kafkaTemplate.send(ORDER_PLACED_TOPIC, order.getOrderNumber(), event);
            log.info("📨 Kafka event published to '{}' for order {}", ORDER_PLACED_TOPIC, order.getOrderNumber());
        } catch (Exception e) {
            log.error("Failed to publish Kafka event for order {}: {}", order.getOrderNumber(), e.getMessage());
        }
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<Order> getOrdersByUser(String email) {
        return orderRepository.findByUserEmail(email);
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderNumber));
    }

    public Order updateOrderStatus(String orderNumber, String status) {
        Order order = getOrderByNumber(orderNumber);
        order.setStatus(status);
        orderRepository.save(order);
        // Publish status update event
        kafkaTemplate.send("order.status.update", orderNumber,
                java.util.Map.of("orderNumber", orderNumber, "userEmail", order.getUserEmail(), "status", status));
        log.info("📨 Kafka event published to 'order.status.update' for order {}: {}", orderNumber, status);
        return order;
    }

    private OrderItem mapToEntity(OrderRequest.OrderItemDto itemDto) {
        return OrderItem.builder()
                .productId(itemDto.getProductId())
                .productName(itemDto.getProductName())
                .price(itemDto.getPrice())
                .quantity(itemDto.getQuantity())
                .build();
    }
}
