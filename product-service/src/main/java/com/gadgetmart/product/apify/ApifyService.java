package com.gadgetmart.product.apify;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gadgetmart.product.model.Product.PlatformPrice;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class ApifyService {

    @Value("${apify.token}")
    private String apifyToken;

    // Actor ID for "Google Shopping Scraper" - covers multiple stores like
    // Flipkart, Amazon, etc.
    // Alternatively, we can use specific actors for Amazon (e.g.,
    // 'junglee/amazon-scraper')
    private static final String GOOGLE_SHOPPING_ACTOR = "apify~google-shopping-scraper";

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<PlatformPrice> fetchPricesFromApify(String productName) {
        log.info("Fetching prices via Apify for: {}", productName);

        // 1. Prepare the Input JSON for the Actor
        String jsonInput = String.format("{\"search\": \"%s\", \"gl\": \"in\", \"hl\": \"en\", \"maxItems\": 10}",
                productName);

        // 2. Start the Actor Run (synchronous wait for simplicity, ideally async)
        // Using `run-sync-get-dataset-items` API to get results immediately
        String url = "https://api.apify.com/v2/acts/" + GOOGLE_SHOPPING_ACTOR + "/run-sync-get-dataset-items";

        RequestBody body = RequestBody.create(jsonInput, MediaType.parse("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(url)
                .header("Authorization", "Bearer " + apifyToken)
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                log.error("Apify API failed: {}", response);
                return Collections.emptyList();
            }

            String responseBody = response.body().string();
            return parseApifyResponse(responseBody);

        } catch (IOException e) {
            log.error("Error calling Apify", e);
            return Collections.emptyList();
        }
    }

    private List<PlatformPrice> parseApifyResponse(String jsonResponse) {
        List<PlatformPrice> prices = new ArrayList<>();
        try {
            JsonNode root = objectMapper.readTree(jsonResponse);

            if (root.isArray()) {
                for (JsonNode item : root) {
                    // This parsing logic depends on the specific Actor's output schema
                    // For 'epctex/google-shopping-scraper':
                    String title = item.path("productName").asText();
                    String merchant = item.path("merchantName").asText("Unknown Store");
                    String priceStr = item.path("price").asText("0");
                    String link = item.path("merchantLink").asText("");

                    // Cleanup price string (e.g., "₹12,999" -> 12999)
                    priceStr = priceStr.replaceAll("[^\\d.]", "");
                    if (priceStr.isEmpty())
                        continue;

                    BigDecimal price = new BigDecimal(priceStr);

                    prices.add(PlatformPrice.builder()
                            .platformName(merchant)
                            .platformProductUrl(link)
                            .price(price)
                            .currency("INR")
                            .available(true)
                            .fetchedAt(LocalDateTime.now())
                            .build());
                }
            }
        } catch (Exception e) {
            log.error("Failed to parse Apify response", e);
        }
        return prices;
    }
}
