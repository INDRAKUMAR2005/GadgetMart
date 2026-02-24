package com.gadgetmart.product.connector;

import com.gadgetmart.product.model.Product.PlatformPrice;
import java.util.Optional;

/**
 * Interface that all external price fetchers (Amazon, Flipkart, etc.) must implement.
 */
public interface PriceFetcher {

    /**
     * Gets the unique name of the platform (e.g., "AMAZON_CREATORS", "FLIPKART_V1").
     * used to identify which connector is running.
     */
    String getPlatformName();

    /**
     * Fetches the current price and availability for a given product search term.
     * Note: In a real scenario, we might search by UPC/EAN if available.
     * For now, we search by product name.
     * 
     * @param productName Name of the product to search.
     * @return PlatformPrice object containing price, URL, availability.
     */
    Optional<PlatformPrice> fetchPrice(String productName);
}
