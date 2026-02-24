package com.gadgetmart.product.connector.mock;

import com.gadgetmart.product.connector.PriceFetcher;
import com.gadgetmart.product.model.Product;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Component
public class MockFlipkartFetcher implements PriceFetcher {
    
    private final Random random = new Random();

    @Override
    public String getPlatformName() {
        return "Flipkart";
    }

    @Override
    public Optional<Product.PlatformPrice> fetchPrice(String productName) {
        // Similar to Amazon, generate a competing price
        long seed = productName.hashCode() + 123456789; // Different seed
        random.setSeed(seed);
        
        int basePrice = 9000 + random.nextInt(52000); // Slightly cheaper/more expensive
        BigDecimal price = BigDecimal.valueOf(basePrice);
        
        return Optional.of(Product.PlatformPrice.builder()
                .platformName("Flipkart")
                .platformProductUrl("https://www.flipkart.com/search?q=" + productName.replace(" ", "%20"))
                .price(price)
                .currency("INR")
                .available(true)
                .promoCode("FLIP20") // Mock promo code
                .fetchedAt(LocalDateTime.now())
                .build());
    }
}
