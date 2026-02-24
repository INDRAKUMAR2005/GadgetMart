package com.gadgetmart.payment.api;

import com.gadgetmart.payment.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * POST /api/payments/create-order
     * Body: { orderNumber, userEmail, amount }
     *
     * Returns Razorpay order details for frontend to open checkout.
     * ⚠️ Only for GadgetMart OWN items. Affiliate links redirect directly.
     */
    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> body) {
        try {
            String orderNumber = (String) body.get("orderNumber");
            String userEmail = (String) body.get("userEmail");
            BigDecimal amount = new BigDecimal(body.get("amount").toString());

            Map<String, Object> result = paymentService.createRazorpayOrder(orderNumber, userEmail, amount);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Failed to create Razorpay order: {}", e.getMessage());
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/payments/verify
     * Body: { razorpayOrderId, razorpayPaymentId, razorpaySignature }
     *
     * Verifies HMAC signature after Razorpay checkout completes.
     */
    @PostMapping("/verify")
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, String> body) {
        Map<String, Object> result = paymentService.verifyAndCapturePayment(
                body.get("razorpayOrderId"),
                body.get("razorpayPaymentId"),
                body.get("razorpaySignature")
        );
        if ("FAILED".equals(result.get("status"))) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * GET /api/payments/{orderNumber}/status
     * Checks payment status for a given GadgetMart order.
     */
    @GetMapping("/{orderNumber}/status")
    public ResponseEntity<Map<String, Object>> getStatus(@PathVariable String orderNumber) {
        return ResponseEntity.ok(paymentService.getPaymentStatus(orderNumber));
    }
}
