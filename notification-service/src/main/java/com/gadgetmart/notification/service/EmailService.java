package com.gadgetmart.notification.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.gadgetmart.notification.event.OrderPlacedEvent;
import com.gadgetmart.notification.event.OtpRequestedEvent;
import com.gadgetmart.notification.event.OrderStatusUpdatedEvent;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    // ─────────────────────────────────────────────
    // 1. ORDER CONFIRMATION EMAIL
    // ─────────────────────────────────────────────
    public void sendOrderConfirmation(OrderPlacedEvent event) {
        try {
            String html = buildOrderConfirmationHtml(event);
            sendEmail(event.getUserEmail(),
                    "🛒 Order Confirmed! #" + event.getOrderNumber().substring(0, 8).toUpperCase(),
                    html);
            log.info("✅ Order confirmation email sent to {}", event.getUserEmail());
        } catch (Exception e) {
            log.error("❌ Failed to send order confirmation email: {}", e.getMessage());
        }
    }

    // ─────────────────────────────────────────────
    // 2. OTP EMAIL
    // ─────────────────────────────────────────────
    public void sendOtpEmail(OtpRequestedEvent event) {
        try {
            String html = buildOtpHtml(event.getOtpCode(), event.getPurpose());
            sendEmail(event.getEmail(), "🔐 Your GadgetMart OTP Code", html);
            log.info("✅ OTP email sent to {} for {}", event.getEmail(), event.getPurpose());
        } catch (Exception e) {
            log.error("❌ Failed to send OTP email: {}", e.getMessage());
        }
    }

    // ─────────────────────────────────────────────
    // 3. ORDER STATUS UPDATE EMAIL
    // ─────────────────────────────────────────────
    public void sendStatusUpdateEmail(OrderStatusUpdatedEvent event) {
        try {
            String html = buildStatusUpdateHtml(event);
            String subject = getStatusSubject(event.getStatus()) + " #" + event.getOrderNumber().substring(0, 8).toUpperCase();
            sendEmail(event.getUserEmail(), subject, html);
            log.info("✅ Status update email sent to {} — status: {}", event.getUserEmail(), event.getStatus());
        } catch (Exception e) {
            log.error("❌ Failed to send status update email: {}", e.getMessage());
        }
    }

    // ─────────────────────────────────────────────
    // CORE SEND METHOD
    // ─────────────────────────────────────────────
    private void sendEmail(String to, String subject, String htmlBody) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromAddress);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlBody, true);
        mailSender.send(message);
    }

    // ─────────────────────────────────────────────
    // HTML TEMPLATES
    // ─────────────────────────────────────────────
    private String buildOrderConfirmationHtml(OrderPlacedEvent event) {
        StringBuilder items = new StringBuilder();
        for (OrderPlacedEvent.OrderItemEntry item : event.getItems()) {
            items.append(String.format("""
                <tr>
                  <td style="padding:12px;border-bottom:1px solid #e2e8f0;">%s</td>
                  <td style="padding:12px;border-bottom:1px solid #e2e8f0;text-align:center;">%d</td>
                  <td style="padding:12px;border-bottom:1px solid #e2e8f0;text-align:right;">₹%s</td>
                </tr>
                """, item.getProductName(), item.getQuantity(),
                    item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()))));
        }

        return String.format("""
            <!DOCTYPE html>
            <html>
            <body style="margin:0;font-family:'Segoe UI',sans-serif;background:#f8fafc;">
              <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <div style="background:linear-gradient(135deg,#667eea,#764ba2);padding:40px;text-align:center;">
                  <h1 style="color:#fff;margin:0;font-size:28px;">🛒 GadgetMart</h1>
                  <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">Order Confirmation</p>
                </div>
                <div style="padding:32px;">
                  <h2 style="color:#1a202c;margin-top:0;">Hi there! Your order is confirmed 🎉</h2>
                  <p style="color:#4a5568;">Thank you for shopping with GadgetMart. We're preparing your order right now!</p>
                  
                  <div style="background:#f7fafc;border-radius:12px;padding:20px;margin:24px 0;">
                    <p style="margin:0;color:#718096;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Order Number</p>
                    <p style="margin:4px 0 0;color:#667eea;font-size:22px;font-weight:700;font-family:monospace;">%s</p>
                  </div>
                  
                  <table style="width:100%%;border-collapse:collapse;margin:24px 0;">
                    <thead>
                      <tr style="background:#f7fafc;">
                        <th style="padding:12px;text-align:left;color:#4a5568;font-size:13px;">Product</th>
                        <th style="padding:12px;text-align:center;color:#4a5568;font-size:13px;">Qty</th>
                        <th style="padding:12px;text-align:right;color:#4a5568;font-size:13px;">Amount</th>
                      </tr>
                    </thead>
                    <tbody>%s</tbody>
                  </table>
                  
                  <div style="background:linear-gradient(135deg,#667eea20,#764ba220);border-radius:12px;padding:20px;text-align:right;">
                    <span style="color:#4a5568;font-size:14px;">Total Amount</span>
                    <div style="color:#667eea;font-size:28px;font-weight:700;">₹%s</div>
                  </div>
                  
                  <p style="margin-top:24px;color:#718096;font-size:14px;">We'll send you another email once your order is shipped. Happy shopping! 🚀</p>
                </div>
                <div style="background:#f7fafc;padding:20px;text-align:center;">
                  <p style="margin:0;color:#a0aec0;font-size:12px;">© 2026 GadgetMart — India's Smartest Price Comparator</p>
                </div>
              </div>
            </body>
            </html>
            """, event.getOrderNumber().substring(0, 8).toUpperCase(), items, event.getTotalAmount());
    }

    private String buildOtpHtml(String otp, String purpose) {
        String purposeText = switch (purpose) {
            case "LOGIN" -> "signing in to your account";
            case "REGISTER" -> "creating your account";
            case "RESET_PASSWORD" -> "resetting your password";
            default -> "verifying your identity";
        };

        return String.format("""
            <!DOCTYPE html>
            <html>
            <body style="margin:0;font-family:'Segoe UI',sans-serif;background:#f8fafc;">
              <div style="max-width:500px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <div style="background:linear-gradient(135deg,#11998e,#38ef7d);padding:40px;text-align:center;">
                  <h1 style="color:#fff;margin:0;font-size:28px;">🔐 GadgetMart</h1>
                  <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;">Security Code</p>
                </div>
                <div style="padding:40px;text-align:center;">
                  <p style="color:#4a5568;font-size:16px;">Use this OTP for <strong>%s</strong>:</p>
                  
                  <div style="background:#f0fff4;border:2px dashed #38ef7d;border-radius:16px;padding:24px;margin:24px 0;display:inline-block;width:100%%;">
                    <div style="font-size:48px;font-weight:900;letter-spacing:12px;color:#11998e;font-family:monospace;">%s</div>
                  </div>
                  
                  <div style="background:#fff3cd;border-radius:8px;padding:12px;margin:16px 0;">
                    <p style="margin:0;color:#856404;font-size:13px;">⏰ This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
                  </div>
                  
                  <p style="color:#a0aec0;font-size:13px;">If you didn't request this, please ignore this email.</p>
                </div>
                <div style="background:#f7fafc;padding:20px;text-align:center;">
                  <p style="margin:0;color:#a0aec0;font-size:12px;">© 2026 GadgetMart | This is an automated email</p>
                </div>
              </div>
            </body>
            </html>
            """, purposeText, otp);
    }

    private String buildStatusUpdateHtml(OrderStatusUpdatedEvent event) {
        String emoji = switch (event.getStatus()) {
            case "SHIPPED" -> "🚚";
            case "DELIVERED" -> "✅";
            case "CANCELLED" -> "❌";
            case "OUT_FOR_DELIVERY" -> "📦";
            default -> "🔄";
        };

        return String.format("""
            <!DOCTYPE html>
            <html>
            <body style="margin:0;font-family:'Segoe UI',sans-serif;background:#f8fafc;">
              <div style="max-width:500px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                <div style="background:linear-gradient(135deg,#f093fb,#f5576c);padding:40px;text-align:center;">
                  <div style="font-size:48px;">%s</div>
                  <h1 style="color:#fff;margin:8px 0 0;font-size:22px;">Order Update</h1>
                </div>
                <div style="padding:32px;text-align:center;">
                  <p style="color:#4a5568;font-size:16px;">Your order status has been updated to:</p>
                  <div style="background:linear-gradient(135deg,#f093fb20,#f5576c20);border-radius:12px;padding:20px;margin:16px 0;">
                    <span style="color:#f5576c;font-size:24px;font-weight:700;">%s</span>
                  </div>
                  <div style="background:#f7fafc;border-radius:8px;padding:12px;margin:16px 0;">
                    <p style="margin:0;color:#718096;font-size:13px;">Order #<strong>%s</strong></p>
                  </div>
                </div>
                <div style="background:#f7fafc;padding:20px;text-align:center;">
                  <p style="margin:0;color:#a0aec0;font-size:12px;">© 2026 GadgetMart</p>
                </div>
              </div>
            </body>
            </html>
            """, emoji, event.getStatus(), event.getOrderNumber().substring(0, 8).toUpperCase());
    }

    private String getStatusSubject(String status) {
        return switch (status) {
            case "SHIPPED" -> "🚚 Your Order is Shipped!";
            case "DELIVERED" -> "✅ Order Delivered — Enjoy!";
            case "CANCELLED" -> "❌ Order Cancelled";
            case "OUT_FOR_DELIVERY" -> "📦 Out for Delivery!";
            default -> "🔄 Order Status Update";
        };
    }
}
