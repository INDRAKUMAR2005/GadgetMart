package com.gadgetmart.product.connector.mock;

import com.gadgetmart.product.connector.PriceFetcher;
import com.gadgetmart.product.model.Product;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Component
public class MockInstamartFetcher implements PriceFetcher {

    private final Random random = new Random();

    @Override
    public String getPlatformName() {
        return "Swiggy Instamart";
    }

    @Override
    public Optional<Product.PlatformPrice> fetchPrice(String productName) {
        long seed = productName.hashCode() + 111111111;
        random.setSeed(seed);

        int basePrice = 10500 + random.nextInt(49000);
        BigDecimal price = BigDecimal.valueOf(basePrice);

        return Optional.of(Product.PlatformPrice.builder()
                .platformName("Swiggy Instamart")
                .platformProductUrl("https://www.swiggy.com/instamart/search?q=" + productName.replace(" ", "%20"))
                .price(price)
                .currency("INR")
                .available(true)
                .promoCode("INSTA20")
                .fetchedAt(LocalDateTime.now())
                .build());
    }
}
