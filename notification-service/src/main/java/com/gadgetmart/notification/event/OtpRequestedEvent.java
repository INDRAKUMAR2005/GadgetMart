package com.gadgetmart.notification.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OtpRequestedEvent {
    private String email;
    private String otpCode;
    private String purpose; // LOGIN, REGISTER, RESET_PASSWORD
}
