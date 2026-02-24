package com.gadgetmart.product.connector.mock;

import com.gadgetmart.product.connector.PriceFetcher;
import com.gadgetmart.product.model.Product.PlatformPrice;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

/**
 * A connector that mimics Amazon behavior.
 * Generates somewhat realistic but random prices for testing.
 */
@Component
public class MockAmazonFetcher implements PriceFetcher {

    private final Random random = new Random();

    @Override
    public String getPlatformName() {
        return "Amazon (Mock)";
    }

    @Override
    public Optional<PlatformPrice> fetchPrice(String productName) {
        // In reality, this would make an HTTP call to the Amazon Creators API
        // For now, generate a price with some variance based on the product name.
        
        // Generate a pseudo-random price between 10,000 and 60,000 based on product name hash
        long seed = productName.hashCode();
        random.setSeed(seed);
        
        int basePrice = 10000 + random.nextInt(50000);
        BigDecimal price = BigDecimal.valueOf(basePrice);
        
        return Optional.of(PlatformPrice.builder()
                .platformName("Amazon")
                .platformProductUrl("https://www.amazon.in/s?k=" + productName.replace(" ", "+"))
                .price(price)
                .currency("INR")
                .available(true)
                .fetchedAt(LocalDateTime.now())
                .build());
    }
}
