package com.gadgetmart.payment.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderNumber;       // GadgetMart internal order ID
    private String userEmail;

    // Razorpay IDs
    private String razorpayOrderId;   // Created before payment
    private String razorpayPaymentId; // Filled after payment success
    private String razorpaySignature; // Verified after payment

    private BigDecimal amount;
    private String currency;

    private String status; // CREATED, SUCCESS, FAILED, REFUNDED

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
