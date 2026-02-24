package com.gadgetmart.product.connector.mock;

import com.gadgetmart.product.connector.PriceFetcher;
import com.gadgetmart.product.model.Product;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

@Component
public class MockMeeshoFetcher implements PriceFetcher {

    private final Random random = new Random();

    @Override
    public String getPlatformName() {
        return "Meesho";
    }

    @Override
    public Optional<Product.PlatformPrice> fetchPrice(String productName) {
        long seed = productName.hashCode() + 555555555;
        random.setSeed(seed);

        int basePrice = 8000 + random.nextInt(45000);
        BigDecimal price = BigDecimal.valueOf(basePrice);

        return Optional.of(Product.PlatformPrice.builder()
                .platformName("Meesho")
                .platformProductUrl("https://www.meesho.com/search?q=" + productName.replace(" ", "%20"))
                .price(price)
                .currency("INR")
                .available(true)
                .promoCode("MEESHO10")
                .fetchedAt(LocalDateTime.now())
                .build());
    }
}
