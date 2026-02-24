package com.gadgetmart.user.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gadgetmart.user.model.SavedProduct;
import com.gadgetmart.user.model.User;
import com.gadgetmart.user.repository.SavedProductRepository;
import com.gadgetmart.user.repository.UserRepository;
import com.gadgetmart.user.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final SavedProductRepository savedProductRepository;
    private final StringRedisTemplate redisTemplate;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final JwtUtil jwtUtil;

    private static final String OTP_PREFIX = "otp:";
    private static final String OTP_TOPIC = "otp.requested";

    @Value("${app.otp.ttl-minutes}")
    private long otpTtlMinutes;

    /**
     * Step 1 — Send OTP.
     */
    public Map<String, String> sendOtp(String email, String purpose) {
        String otp = generateOtp();
        String redisKey = OTP_PREFIX + email;

        redisTemplate.opsForValue().set(redisKey, otp, Duration.ofMinutes(otpTtlMinutes));
        log.info("✅ OTP stored in Redis for {} (TTL: {} min)", email, otpTtlMinutes);

        // Publish Kafka event → notification-service sends the email
        try {
            String eventJson = objectMapper.writeValueAsString(Map.of(
                    "email", email,
                    "otpCode", otp,
                    "purpose", purpose));
            kafkaTemplate.send(OTP_TOPIC, email, eventJson);
            log.info("📨 OTP Kafka event published for {}", email);
        } catch (Exception e) {
            log.error("Failed to publish OTP Kafka event: {}", e.getMessage());
        }

        return Map.of("message", "OTP sent to " + email, "status", "SUCCESS");
    }

    /**
     * Step 2 — Verify OTP.
     */
    public Map<String, Object> verifyOtp(String email, String otp) {
        String redisKey = OTP_PREFIX + email;
        String storedOtp = redisTemplate.opsForValue().get(redisKey);

        if (storedOtp == null) {
            return Map.of("status", "FAILED", "message", "OTP expired or not requested");
        }

        if (!storedOtp.equals(otp)) {
            return Map.of("status", "FAILED", "message", "Invalid OTP");
        }

        redisTemplate.delete(redisKey);
        log.info("✅ OTP verified for {}", email);

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            log.info("👤 New user registering via OTP: {}", email);
            return userRepository.save(User.builder()
                    .email(email)
                    .role("USER")
                    .status("ACTIVE")
                    .createdAt(LocalDateTime.now())
                    .build());
        });

        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        log.info("🔑 JWT generated for {}", email);

        return Map.of(
                "status", "SUCCESS",
                "token", token,
                "email", user.getEmail(),
                "name", user.getName() != null ? user.getName() : "",
                "role", user.getRole());
    }

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found: " + email));
    }

    public User updateProfile(String email, User updatedInfo) {
        User user = getProfile(email);
        if (updatedInfo.getName() != null)
            user.setName(updatedInfo.getName());
        if (updatedInfo.getPhone() != null)
            user.setPhone(updatedInfo.getPhone());
        if (updatedInfo.getLocationName() != null)
            user.setLocationName(updatedInfo.getLocationName());
        if (updatedInfo.getAddress() != null)
            user.setAddress(updatedInfo.getAddress());
        if (updatedInfo.getCity() != null)
            user.setCity(updatedInfo.getCity());
        if (updatedInfo.getPincode() != null)
            user.setPincode(updatedInfo.getPincode());
        return userRepository.save(user);
    }

    public Map<String, String> saveProduct(String email, Map<String, Object> productData) {
        if (savedProductRepository.findByUserEmailAndProductName(email, (String) productData.get("name")).isPresent()) {
            return Map.of("status", "SUCCESS", "message", "Product already saved");
        }

        savedProductRepository.save(SavedProduct.builder()
                .userEmail(email)
                .productName((String) productData.get("name"))
                .brand((String) productData.get("brand"))
                .category((String) productData.get("category"))
                .imageUrl((String) productData.get("imageUrl"))
                .price(Double.valueOf(String.valueOf(productData.get("price"))))
                .savedAt(LocalDateTime.now())
                .build());
        return Map.of("status", "SUCCESS", "message", "Product saved successfully");
    }

    public List<SavedProduct> getSavedProducts(String email) {
        return savedProductRepository.findByUserEmail(email);
    }

    @org.springframework.transaction.annotation.Transactional
    public void removeSavedProduct(String email, String productName) {
        savedProductRepository.deleteByUserEmailAndProductName(email, productName);
    }

    private String generateOtp() {
        SecureRandom random = new SecureRandom();
        return String.valueOf(100000 + random.nextInt(900000));
    }
}
