package com.gadgetmart.product.config;

import com.gadgetmart.product.model.Product;
import com.gadgetmart.product.model.Product.PlatformPrice;
import com.gadgetmart.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

        private final ProductRepository productRepository;
        private final com.gadgetmart.product.service.UnsplashService unsplashService;

        @Override
        public void run(String... args) throws Exception {
                // Clear existing to refresh with accurate images
                log.info("🗑️ Deleting all existing products from MongoDB...");
                productRepository.deleteAll();

                log.info("🚀 Seeding product catalog with accurate gadget data from Unsplash API...");

                Object[][] productData = {
                                // Smartphones
                                { "iPhone 16 Pro Max", "Apple", "Smartphones",
                                                "Titanium Black, 256GB, 6.9-inch Display" },
                                { "Samsung Galaxy S25 Ultra", "Samsung", "Smartphones",
                                                "Titanium Gray, 512GB, Snapdragon 8 Gen 4" },
                                { "Google Pixel 9 Pro XL", "Google", "Smartphones",
                                                "Obsidian, 128GB, Gemini AI Integrated" },
                                { "Nothing Phone (3)", "Nothing", "Smartphones",
                                                "Transparent Black, Glyph Interface 3.0" },

                                // Laptops
                                { "MacBook Pro M4 Max", "Apple", "Laptops",
                                                "Space Black, 32GB RAM, 1TB SSD, 16-inch Liquid Retina" },
                                { "Dell XPS 16 (2025)", "Dell", "Laptops",
                                                "Platinum Silver, OLED Touch Display, RTX 5060" },
                                { "ASUS ROG Zephyrus G16", "ASUS", "Laptops",
                                                "Eclipse Gray, 240Hz Nebula Display, 32GB RAM" },
                                { "Microsoft Surface Pro 11", "Microsoft", "Laptops",
                                                "Sapphire Blue, Copilot+ PC, OLED Keyboard" },

                                // Audio
                                { "Sony WH-1000XM6", "Sony", "Audio",
                                                "Industry-leading Noise Canceling, 40hr Battery" },
                                { "AirPods Max 2", "Apple", "Audio", "Spatial Audio, USB-C Charging, Midnight Black" },
                                { "Nothing Ear (3)", "Nothing", "Audio", "Transparent ID, Hi-Res Wireless Audio" },

                                // Gaming
                                { "PlayStation 5 Pro", "Sony", "Gaming",
                                                "8K Resolution, 2TB Storage, Advanced Ray Tracing" },
                                { "Xbox Series X Elite", "Microsoft", "Gaming", "1TB SSD, 4K Gaming, Carbon Black" },
                                { "Nintendo Switch 2", "Nintendo", "Gaming",
                                                "OLED Display, 4K Docking, backward compatibility" },

                                // Cameras
                                { "Sony A9 III", "Sony", "Cameras", "Global Shutter, 120fps Burst, Full-frame Sensor" },
                                { "DJI Mavic 4 Pro", "DJI", "Cameras", "Dual Hasselblad Cameras, 45min Flight Time" }
                };

                Random random = new Random();
                List<Product> products = new ArrayList<>();

                for (Object[] data : productData) {
                        String name = (String) data[0];
                        String brand = (String) data[1];
                        String category = (String) data[2];
                        String specs = (String) data[3];

                        log.info("Fetching exact image for: {}", name);
                        String imageUrl = unsplashService.getExactProductImage(name);

                        BigDecimal basePrice = BigDecimal.valueOf(10000 + random.nextInt(150000));

                        List<PlatformPrice> prices = new ArrayList<>();
                        prices.add(createPrice("Amazon", basePrice.add(BigDecimal.valueOf(random.nextInt(2000) - 1000)),
                                        name));
                        prices.add(createPrice("Flipkart",
                                        basePrice.add(BigDecimal.valueOf(random.nextInt(2000) - 1000)), name));
                        prices.add(createPrice("Meesho",
                                        basePrice.subtract(BigDecimal.valueOf(2000 + random.nextInt(5000))), name));
                        prices.add(createPrice("Zepto", basePrice.add(BigDecimal.valueOf(1000 + random.nextInt(2000))),
                                        name));
                        prices.add(createPrice("Shopify", basePrice.add(BigDecimal.valueOf(random.nextInt(1000))),
                                        name));
                        prices.add(createPrice("Swiggy Instamart",
                                        basePrice.add(BigDecimal.valueOf(500 + random.nextInt(1500))), name));
                        prices.add(createPrice("GadgetMart",
                                        basePrice.subtract(BigDecimal.valueOf(random.nextInt(3000) + 1000)), name));

                        Product product = Product.builder()
                                        .name(name)
                                        .brand(brand)
                                        .category(category)
                                        .description(specs
                                                        + ". High-performance tech aggregated at best market prices.")
                                        .imageUrl(imageUrl)
                                        .prices(prices)
                                        .lastUpdated(LocalDateTime.now())
                                        .build();

                        products.add(product);
                }

                // Add 40+ more generic items to reach 60+ but with category logic
                for (int i = 0; i < 45; i++) {
                        String cat = categories[i % categories.length];
                        String b = brands[i % brands.length];
                        String name = b + " " + cat + " Pro " + (i + 1);

                        products.add(Product.builder()
                                        .name(name)
                                        .brand(b)
                                        .category(cat)
                                        .description("Advanced " + cat + " with premium build and latest specs.")
                                        .imageUrl(getGenericImage(cat, i))
                                        .prices(List.of(
                                                        createPrice("Amazon",
                                                                        BigDecimal.valueOf(
                                                                                        6000 + random.nextInt(45000)),
                                                                        name),
                                                        createPrice("Flipkart",
                                                                        BigDecimal.valueOf(
                                                                                        5800 + random.nextInt(46000)),
                                                                        name),
                                                        createPrice("GadgetMart",
                                                                        BigDecimal.valueOf(
                                                                                        5000 + random.nextInt(40000)),
                                                                        name)))
                                        .lastUpdated(LocalDateTime.now())
                                        .build());
                }

                productRepository.saveAll(products);
                log.info("✅ Successfully seeded {} categorized and accurate products.", products.size());
        }

        private String getGenericImage(String category, int index) {
                String base = "https://images.unsplash.com/photo-";
                return switch (category) {
                        case "Smartphones" -> base + "1511706853403-8c5138c230e3";
                        case "Laptops" -> base + "1496181133206-80ce9b88a853";
                        case "Audio" -> base + "1546435770-a3e426fb472b";
                        case "Gaming" -> base + "1542751371-adc38448a05e";
                        case "Cameras" -> base + "1526170315870-ef0d96f09f5a";
                        default -> base + "1519389950473-47ba0277781c";
                } + "?auto=format&fit=crop&q=80&w=800&sig=" + index;
        }

        private String[] categories = { "Smartphones", "Laptops", "Audio", "Wearables", "Gaming", "Cameras" };
        private String[] brands = { "Apple", "Samsung", "Sony", "Dell", "ASUS", "Google", "Microsoft", "Logitech",
                        "DJI", "GoPro" };

        private PlatformPrice createPrice(String platform, BigDecimal price, String productName) {
                String searchUrl = switch (platform.toLowerCase()) {
                        case "amazon" -> "https://www.amazon.in/s?k=" + productName.replace(" ", "+");
                        case "flipkart" -> "https://www.flipkart.com/search?q=" + productName.replace(" ", "%20");
                        case "meesho" -> "https://www.meesho.com/search?q=" + productName.replace(" ", "%20");
                        case "zepto" -> "https://www.zeptonow.com/search?query=" + productName.replace(" ", "%20");
                        case "shopify" ->
                                "https://www.google.com/search?q=site:myshopify.com+" + productName.replace(" ", "+");
                        case "swiggy instamart" ->
                                "https://www.swiggy.com/instamart/search?q=" + productName.replace(" ", "%20");
                        default -> "#";
                };

                return PlatformPrice.builder()
                                .platformName(platform)
                                .price(price.max(BigDecimal.valueOf(500)))
                                .currency("INR")
                                .available(true)
                                .platformProductUrl(searchUrl)
                                .fetchedAt(LocalDateTime.now())
                                .build();
        }
}
