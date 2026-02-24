package com.gadgetmart.user.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    private String name;

    private String phone; // Optional, for display only

    private String locationName; // New: Descriptive location name

    private String address;

    private String city;

    private String pincode;

    private String role; // USER, VENDOR, ADMIN

    private String status; // ACTIVE, PENDING_VERIFICATION

    private LocalDateTime createdAt;

    private LocalDateTime lastLoginAt;
}
