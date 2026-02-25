package com.gadgetmart.product.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class UnsplashService {

    @Value("${unsplash.access-key:}")
    private String accessKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getExactProductImage(String productName) {
        try {
            String url = UriComponentsBuilder.fromHttpUrl("https://api.unsplash.com/search/photos")
                    .queryParam("query", productName + " product tech")
                    .queryParam("client_id", accessKey)
                    .queryParam("per_page", 1)
                    .queryParam("orientation", "squarish")
                    .toUriString();

            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.get("results") instanceof List) {
                List<?> results = (List<?>) response.get("results");
                if (!results.isEmpty()) {
                    Map<String, Object> firstResult = (Map<String, Object>) results.get(0);
                    Map<String, String> urls = (Map<String, String>) firstResult.get("urls");
                    return urls.get("regular");
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch image from Unsplash for {}: {}", productName, e.getMessage());
        }

        // Fallback to high-quality tech placeholder if API fails
        return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=800";
    }
}
