package com.gadgetmart.order.consumer;

import com.gadgetmart.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentConsumer {

    private final OrderService orderService;

    @KafkaListener(topics = "payment.success", groupId = "order-group")
    public void handlePaymentSuccess(Map<String, Object> paymentData) {
        String orderNumber = (String) paymentData.get("orderNumber");
        String paymentId = (String) paymentData.get("razorpayPaymentId");

        log.info("💰 Received payment success event for order: {} | Payment ID: {}", orderNumber, paymentId);

        try {
            orderService.updateOrderStatus(orderNumber, "PAID");
            log.info("✅ Order {} status updated to PAID", orderNumber);
        } catch (Exception e) {
            log.error("❌ Failed to update order status after payment: {}", e.getMessage());
        }
    }
}
