package com.gadgetmart.notification.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderStatusUpdatedEvent {
    private String orderNumber;
    private String userEmail;
    private String status;
}
