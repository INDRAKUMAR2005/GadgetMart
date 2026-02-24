package com.gadgetmart.notification.consumer;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gadgetmart.notification.event.OrderPlacedEvent;
import com.gadgetmart.notification.event.OrderStatusUpdatedEvent;
import com.gadgetmart.notification.event.OtpRequestedEvent;
import com.gadgetmart.notification.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final EmailService emailService;
    private final ObjectMapper objectMapper;

    // ─────────────────────────────────────────────────────────────────
    // 1. LISTEN: order.placed → Send Order Confirmation Email
    // ─────────────────────────────────────────────────────────────────
    @KafkaListener(topics = "order.placed", groupId = "notification-service-group")
    public void handleOrderPlaced(String message) {
        try {
            log.info("📨 Received [order.placed] event");
            OrderPlacedEvent event = objectMapper.readValue(message, OrderPlacedEvent.class);
            emailService.sendOrderConfirmation(event);
        } catch (Exception e) {
            log.error("Error processing order.placed event: {}", e.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // 2. LISTEN: otp.requested → Send OTP Email
    // ─────────────────────────────────────────────────────────────────
    @KafkaListener(topics = "otp.requested", groupId = "notification-service-group")
    public void handleOtpRequested(String message) {
        try {
            log.info("📨 Received [otp.requested] event");
            OtpRequestedEvent event = objectMapper.readValue(message, OtpRequestedEvent.class);
            emailService.sendOtpEmail(event);
        } catch (Exception e) {
            log.error("Error processing otp.requested event: {}", e.getMessage());
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // 3. LISTEN: order.status.update → Send Shipping Update Email
    // ─────────────────────────────────────────────────────────────────
    @KafkaListener(topics = "order.status.update", groupId = "notification-service-group")
    public void handleOrderStatusUpdate(String message) {
        try {
            log.info("📨 Received [order.status.update] event");
            @SuppressWarnings("unchecked")
            Map<String, String> payload = objectMapper.readValue(message, Map.class);
            OrderStatusUpdatedEvent event = new OrderStatusUpdatedEvent(
                    payload.get("orderNumber"),
                    payload.get("userEmail"),
                    payload.get("status")
            );
            emailService.sendStatusUpdateEmail(event);
        } catch (Exception e) {
            log.error("Error processing order.status.update event: {}", e.getMessage());
        }
    }
}
