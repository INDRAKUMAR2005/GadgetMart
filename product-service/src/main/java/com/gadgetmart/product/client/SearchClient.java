package com.gadgetmart.product.client;

import lombok.Builder;
import lombok.Data;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "search-service")
public interface SearchClient {

    @PostMapping("/api/search/index")
    void indexProduct(@RequestBody ProductIndexDto product);

    @Data
    @Builder
    class ProductIndexDto {
        private String id;
        private String name;
        private String description;
        private String category;
        private String brand;
        private Double minPrice;
    }
}
