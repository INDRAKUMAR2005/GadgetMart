package com.gadgetmart.user.api;

import com.gadgetmart.user.model.SavedProduct;
import com.gadgetmart.user.model.User;
import com.gadgetmart.user.service.AuthService;
import com.gadgetmart.user.util.JwtUtil;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    /** Step 1: Send OTP to email */
    @PostMapping("/send-otp")
    public ResponseEntity<Map<String, String>> sendOtp(
            @RequestParam @Email String email,
            @RequestParam(defaultValue = "LOGIN") String purpose) {
        return ResponseEntity.ok(authService.sendOtp(email, purpose));
    }

    /** Step 2: Verify OTP → returns JWT token */
    @PostMapping("/verify-otp")
    public ResponseEntity<Map<String, Object>> verifyOtp(
            @RequestParam @Email String email,
            @RequestParam @NotBlank String otp) {
        Map<String, Object> result = authService.verifyOtp(email, otp);
        if ("FAILED".equals(result.get("status"))) {
            return ResponseEntity.badRequest().body(result);
        }
        return ResponseEntity.ok(result);
    }

    /** Get current user profile (JWT protected) */
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@RequestHeader("Authorization") String authHeader) {
        String email = extractEmailFromHeader(authHeader);
        return ResponseEntity.ok(authService.getProfile(email));
    }

    /** Update user profile (JWT protected) */
    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody User updatedInfo) {
        String email = extractEmailFromHeader(authHeader);
        return ResponseEntity.ok(authService.updateProfile(email, updatedInfo));
    }

    @PostMapping("/saved")
    public ResponseEntity<Map<String, String>> saveProduct(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> productData) {
        String email = extractEmailFromHeader(authHeader);
        return ResponseEntity.ok(authService.saveProduct(email, productData));
    }

    @GetMapping("/saved")
    public ResponseEntity<List<SavedProduct>> getSavedProducts(
            @RequestHeader("Authorization") String authHeader) {
        String email = extractEmailFromHeader(authHeader);
        return ResponseEntity.ok(authService.getSavedProducts(email));
    }

    @DeleteMapping("/saved/{productName}")
    public ResponseEntity<Void> removeSavedProduct(
            @RequestHeader("Authorization") String authHeader,
            @PathVariable String productName) {
        String email = extractEmailFromHeader(authHeader);
        authService.removeSavedProduct(email, productName);
        return ResponseEntity.ok().build();
    }

    private String extractEmailFromHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        if (!jwtUtil.validateToken(token)) {
            throw new RuntimeException("Invalid or expired token");
        }
        return jwtUtil.extractEmail(token);
    }
}
