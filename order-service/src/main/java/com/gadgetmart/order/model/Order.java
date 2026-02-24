package com.gadgetmart.order.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String orderNumber;
    
    private String userEmail; // Linked to User Service

    @OneToMany(cascade = CascadeType.ALL)
    private List<OrderItem> orderItems;

    private BigDecimal totalAmount;
    
    private String status; // PENDING, PLACED, SHIPPED, DELIVERED, CANCELLED
    
    private LocalDateTime createdAt;
}
