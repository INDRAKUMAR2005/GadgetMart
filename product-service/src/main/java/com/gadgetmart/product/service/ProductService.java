package com.gadgetmart.product.service;

import com.gadgetmart.product.apify.ApifyService;
import com.gadgetmart.product.connector.PriceFetcher;
import com.gadgetmart.product.model.Product;
import com.gadgetmart.product.model.Product.PlatformPrice;
import com.gadgetmart.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.TimeUnit;
import org.springframework.data.redis.core.RedisTemplate;

@Service
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final ApifyService apifyService;
    private final List<PriceFetcher> priceFetchers;
    private final RedisTemplate<String, Object> redisTemplate;
    private final com.gadgetmart.product.client.SearchClient searchClient;

    public ProductService(ProductRepository productRepository, ApifyService apifyService,
            List<PriceFetcher> priceFetchers, RedisTemplate<String, Object> redisTemplate,
            com.gadgetmart.product.client.SearchClient searchClient) {
        this.productRepository = productRepository;
        this.apifyService = apifyService;
        this.priceFetchers = priceFetchers;
        this.redisTemplate = redisTemplate;
        this.searchClient = searchClient;
        log.info("ProductService initialized with {} price fetchers", priceFetchers.size());
    }

    private static final String PRODUCT_CACHE_PREFIX = "product:";

    public Product getProductWithPrices(String productName) {
        String cacheKey = PRODUCT_CACHE_PREFIX + productName.toLowerCase();

        // 1. Check Redis Cache
        try {
            Product cachedProduct = (Product) redisTemplate.opsForValue().get(cacheKey);
            if (cachedProduct != null) {
                log.info("Returning Redis cached prices for {}", productName);
                return cachedProduct;
            }
        } catch (Exception e) {
            log.warn("Redis error: {}", e.getMessage());
        }

        log.info("Fetching prices for product: {}", productName);

        Product existingProduct = productRepository.findByName(productName).orElse(null);
        if (existingProduct != null && isPriceFresh(existingProduct)) {
            log.info("Returning MongoDB cached prices for {}", productName);
            cacheProduct(cacheKey, existingProduct);
            return existingProduct;
        }

        log.info("Prices stale or missing. Fetching from all platforms...");
        List<PlatformPrice> latestPrices = fetchPricesFromAllPlatforms(productName);

        if (existingProduct == null) {
            existingProduct = Product.builder()
                    .name(productName)
                    .category("Electronics")
                    .brand("Unknown")
                    .prices(latestPrices)
                    .lastUpdated(LocalDateTime.now())
                    .build();
        } else {
            existingProduct.setPrices(latestPrices);
            existingProduct.setLastUpdated(LocalDateTime.now());
        }

        Product savedProduct = productRepository.save(existingProduct);
        cacheProduct(cacheKey, savedProduct);
        indexProductInElasticsearch(savedProduct);
        return savedProduct;
    }

    private void indexProductInElasticsearch(Product product) {
        try {
            double minPrice = product.getPrices().stream()
                    .mapToDouble(p -> p.getPrice().doubleValue())
                    .min()
                    .orElse(0.0);

            com.gadgetmart.product.client.SearchClient.ProductIndexDto dto = com.gadgetmart.product.client.SearchClient.ProductIndexDto
                    .builder()
                    .id(product.getId())
                    .name(product.getName())
                    .description(product.getDescription())
                    .category(product.getCategory())
                    .brand(product.getBrand())
                    .minPrice(minPrice)
                    .build();

            searchClient.indexProduct(dto);
            log.info("Product {} indexed in Elasticsearch", product.getName());
        } catch (Exception e) {
            log.warn("Failed to index product in Elasticsearch: {}", e.getMessage());
        }
    }

    private void cacheProduct(String key, Product product) {
        try {
            redisTemplate.opsForValue().set(key, product, 1, TimeUnit.HOURS);
        } catch (Exception e) {
            log.warn("Failed to cache in Redis: {}", e.getMessage());
        }
    }

    private List<PlatformPrice> fetchPricesFromAllPlatforms(String productName) {
        List<PlatformPrice> prices = new ArrayList<>();

        // 1. Try fetching from Apify (Real Data)
        try {
            List<PlatformPrice> apifyPrices = apifyService.fetchPricesFromApify(productName);
            if (!apifyPrices.isEmpty()) {
                prices.addAll(apifyPrices);
                log.info("Successfully fetched {} prices from Apify", apifyPrices.size());
            }
        } catch (Exception e) {
            log.error("Failed to fetch from Apify: {}", e.getMessage());
        }

        // 2. Fallback/Additional Sources (Mocks: Amazon, Flipkart)
        for (PriceFetcher fetcher : priceFetchers) {
            try {
                fetcher.fetchPrice(productName).ifPresent(prices::add);
            } catch (Exception e) {
                log.error("Failed to fetch from {}: {}", fetcher.getPlatformName(), e.getMessage());
            }
        }

        // 3. Add GadgetMart's own price
        prices.add(PlatformPrice.builder()
                .platformName("GadgetMart (Official)")
                .price(BigDecimal.valueOf(10000 + new Random((long) productName.hashCode()).nextInt(50000)))
                .currency("INR")
                .available(true)
                .fetchedAt(LocalDateTime.now())
                .build());

        return prices;
    }

    private boolean isPriceFresh(Product product) {
        if (product.getLastUpdated() == null)
            return false;
        // Prices are fresh if updated within last 60 minutes
        return product.getLastUpdated().isAfter(LocalDateTime.now().minusMinutes(60));
    }
}
