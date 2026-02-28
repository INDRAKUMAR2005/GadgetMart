package com.gadgetmart.payment.service;

import com.gadgetmart.payment.model.Payment;
import com.gadgetmart.payment.repository.PaymentRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Map;

@Service
@Slf4j
public class PaymentService {

        private final PaymentRepository paymentRepository;
        private final KafkaTemplate<String, Object> kafkaTemplate;
        private final RazorpayClient razorpayClient;

        @Value("${razorpay.key-secret}")
        private String razorpaySecret;

        public PaymentService(
                        PaymentRepository paymentRepository,
                        KafkaTemplate<String, Object> kafkaTemplate,
                        @Value("${razorpay.key-id}") String keyId,
                        @Value("${razorpay.key-secret}") String keySecret) throws Exception {
                this.paymentRepository = paymentRepository;
                this.kafkaTemplate = kafkaTemplate;
                this.razorpayClient = new RazorpayClient(keyId, keySecret);
                this.razorpaySecret = keySecret;
        }

        /**
         * Step 1 — Create Razorpay Order.
         * Called when user clicks "Buy from GadgetMart" on a product.
         * IMPORTANT: Only for GadgetMart's own inventory items, NOT for Amazon/Flipkart
         * links.
         */
        public Map<String, Object> createRazorpayOrder(
                        String gadgetmartOrderNumber,
                        String userEmail,
                        BigDecimal amount) throws Exception {

                // ── Guard: fail fast with a clear message if keys are missing ──────────
                if (razorpaySecret == null || razorpaySecret.equals("NOT_SET") || razorpaySecret.isBlank()) {
                        log.error("❌ RAZORPAY_KEY_SECRET is not set. Set it as an environment variable on the server.");
                        throw new IllegalStateException(
                                        "Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET environment variables. "
                                                        + "Get your keys from https://dashboard.razorpay.com/app/keys");
                }

                // Razorpay amount is in paise (1 INR = 100 paise)
                int amountInPaise = amount.multiply(BigDecimal.valueOf(100)).intValue();

                if (razorpayClient == null) {
                        log.error("❌ RazorpayClient is not initialized. Check your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.");
                        throw new IllegalStateException("Payment provider not configured");
                }

                log.info("💳 Initiating Razorpay order for GadgetMart Order: {}, Amount: {} INR", gadgetmartOrderNumber,
                                amount);

                try {
                        JSONObject orderRequest = new JSONObject();
                        orderRequest.put("amount", amountInPaise);
                        orderRequest.put("currency", "INR");
                        orderRequest.put("receipt", gadgetmartOrderNumber);
                        orderRequest.put("notes", new JSONObject()
                                        .put("userEmail", userEmail)
                                        .put("orderNumber", gadgetmartOrderNumber));

                        Order razorpayOrder = razorpayClient.orders.create(orderRequest);
                        String razorpayOrderId = razorpayOrder.get("id");

                        log.info("✅ Razorpay order created successfully: {}", razorpayOrderId);

                        // Persist payment record
                        Payment payment = Payment.builder()
                                        .orderNumber(gadgetmartOrderNumber)
                                        .userEmail(userEmail)
                                        .razorpayOrderId(razorpayOrderId)
                                        .amount(amount)
                                        .currency("INR")
                                        .status("CREATED")
                                        .createdAt(LocalDateTime.now())
                                        .build();
                        paymentRepository.save(payment);

                        return Map.<String, Object>of(
                                        "razorpayOrderId", razorpayOrderId,
                                        "gadgetmartOrderNumber", gadgetmartOrderNumber,
                                        "amount", amountInPaise,
                                        "currency", "INR",
                                        "status", "CREATED");
                } catch (Exception e) {
                        log.error("❌ Failed to create Razorpay order for {}: {}", gadgetmartOrderNumber,
                                        e.getMessage());
                        throw e;
                }
        }

        /**
         * Step 2 — Verify Payment Signature.
         * Called after user completes payment in Razorpay checkout UI.
         * Frontend posts razorpayOrderId + razorpayPaymentId + razorpaySignature.
         */
        public Map<String, Object> verifyAndCapturePayment(
                        String razorpayOrderId,
                        String razorpayPaymentId,
                        String razorpaySignature) {

                try {
                        // Verify HMAC-SHA256 signature
                        boolean isValid = verifySignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
                        if (!isValid) {
                                log.warn("❌ Invalid Razorpay signature for order: {}", razorpayOrderId);
                                return Map.of("status", "FAILED", "message", "Signature verification failed");
                        }

                        // Update payment record
                        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                                        .orElseThrow(() -> new RuntimeException(
                                                        "Payment record not found: " + razorpayOrderId));

                        payment.setRazorpayPaymentId(razorpayPaymentId);
                        payment.setRazorpaySignature(razorpaySignature);
                        payment.setStatus("SUCCESS");
                        payment.setUpdatedAt(LocalDateTime.now());
                        paymentRepository.save(payment);

                        log.info("✅ Payment SUCCESS — Razorpay: {} | Order: {}", razorpayPaymentId,
                                        payment.getOrderNumber());

                        // Publish Kafka event — order-service picks this up to confirm order
                        kafkaTemplate.send("payment.success", payment.getOrderNumber(), Map.of(
                                        "orderNumber", payment.getOrderNumber(),
                                        "userEmail", payment.getUserEmail(),
                                        "razorpayPaymentId", razorpayPaymentId,
                                        "amount", payment.getAmount()));

                        return Map.of(
                                        "status", "SUCCESS",
                                        "orderNumber", payment.getOrderNumber(),
                                        "razorpayPaymentId", razorpayPaymentId);

                } catch (Exception e) {
                        log.error("Payment verification failed: {}", e.getMessage());
                        return Map.of("status", "FAILED", "message", e.getMessage());
                }
        }

        /**
         * Get payment status by GadgetMart order number
         */
        public Map<String, Object> getPaymentStatus(String orderNumber) {
                return paymentRepository.findByOrderNumber(orderNumber)
                                .map(p -> Map.<String, Object>of(
                                                "status", p.getStatus(),
                                                "razorpayPaymentId",
                                                p.getRazorpayPaymentId() != null ? p.getRazorpayPaymentId() : "",
                                                "amount", p.getAmount(),
                                                "createdAt", p.getCreatedAt().toString()))
                                .orElse(Map.of("status", "NOT_FOUND"));
        }

        /**
         * HMAC-SHA256 signature verification
         */
        private boolean verifySignature(String orderId, String paymentId, String signature) throws Exception {
                String payload = orderId + "|" + paymentId;
                Mac mac = Mac.getInstance("HmacSHA256");
                mac.init(new SecretKeySpec(razorpaySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
                byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
                String computedSig = HexFormat.of().formatHex(hash);
                return computedSig.equals(signature);
        }
}
