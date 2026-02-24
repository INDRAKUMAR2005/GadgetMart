package com.gadgetmart.product.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "products")
public class Product {

    @Id
    private String id;
    private String name;
    private String description;
    private String category;
    private String brand;
    private String imageUrl;
    private String vendorEmail; // New: To link product to a specific vendor

    // Aggregated list of prices from different platforms
    private List<PlatformPrice> prices;

    private LocalDateTime lastUpdated;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlatformPrice {
        private String platformName; // e.g., "Amazon", "Flipkart", "GadgetMart"
        private String platformProductUrl;
        private BigDecimal price;
        private String currency; // "INR", "USD"
        private boolean available;
        private String promoCode; // Optional promo if found
        private LocalDateTime fetchedAt;
    }
}
