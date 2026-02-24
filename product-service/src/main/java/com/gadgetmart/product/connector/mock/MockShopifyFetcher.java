package com.gadgetmart.product.connector.mock;

import com.gadgetmart.product.connector.PriceFetcher;
import com.gadgetmart.product.model.Product;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Component
public class MockShopifyFetcher implements PriceFetcher {

    private final Random random = new Random();

    @Override
    public String getPlatformName() {
        return "Shopify (Global Store)";
    }

    @Override
    public Optional<Product.PlatformPrice> fetchPrice(String productName) {
        long seed = productName.hashCode() + 777777777;
        random.setSeed(seed);

        // Shopify stores might have higher/different pricing models
        int basePrice = 12000 + random.nextInt(60000);
        BigDecimal price = BigDecimal.valueOf(basePrice);

        return Optional.of(Product.PlatformPrice.builder()
                .platformName("Shopify Store")
                .platformProductUrl("https://myshopify.com/search?q=" + productName.replace(" ", "%20"))
                .price(price)
                .currency("INR")
                .available(true)
                .fetchedAt(LocalDateTime.now())
                .build());
    }
}
