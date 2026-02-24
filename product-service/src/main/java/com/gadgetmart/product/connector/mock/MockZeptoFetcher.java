package com.gadgetmart.product.connector.mock;

import com.gadgetmart.product.connector.PriceFetcher;
import com.gadgetmart.product.model.Product;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Component
public class MockZeptoFetcher implements PriceFetcher {

    private final Random random = new Random();

    @Override
    public String getPlatformName() {
        return "Zepto";
    }

    @Override
    public Optional<Product.PlatformPrice> fetchPrice(String productName) {
        long seed = productName.hashCode() + 999999999;
        random.setSeed(seed);

        int basePrice = 11000 + random.nextInt(48000);
        BigDecimal price = BigDecimal.valueOf(basePrice);

        return Optional.of(Product.PlatformPrice.builder()
                .platformName("Zepto")
                .platformProductUrl("https://www.zeptonow.com/search?q=" + productName.replace(" ", "%20"))
                .price(price)
                .currency("INR")
                .available(true)
                .promoCode("ZEPTO50")
                .fetchedAt(LocalDateTime.now())
                .build());
    }
}
