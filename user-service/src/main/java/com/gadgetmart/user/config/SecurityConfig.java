package com.gadgetmart.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // All auth endpoints are public
                        .requestMatchers("/api/auth/send-otp", "/api/auth/verify-otp").permitAll()
                        .requestMatchers("/api/public/**", "/actuator/**").permitAll()
                        // Everything else requires a valid JWT (validated at controller level)
                        .anyRequest().permitAll()); // Gateway handles JWT guard for cross-service
        return http.build();
    }
}
