package com.gadgetmart.user.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "saved_products")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedProduct {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private String productName;

    private String brand;
    private String category;
    private String imageUrl;
    private Double price;

    private LocalDateTime savedAt;
}
