package com.gadgetmart.order.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderPlacedEvent {
    private String orderNumber;
    private String userEmail;
    private BigDecimal totalAmount;
    private List<OrderItemEntry> items;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class OrderItemEntry {
        private String productName;
        private Integer quantity;
        private BigDecimal price;
    }
}
