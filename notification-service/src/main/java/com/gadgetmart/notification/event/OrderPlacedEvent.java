package com.gadgetmart.notification.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderPlacedEvent {
    private String orderNumber;
    private String userEmail;
    private BigDecimal totalAmount;
    private List<OrderItemEntry> items;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderItemEntry {
        private String productName;
        private Integer quantity;
        private BigDecimal price;
    }
}
