package com.gadgetmart.product.api;

import com.gadgetmart.product.model.Product;
import com.gadgetmart.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/{name}")
    public ResponseEntity<Product> getProductByName(@PathVariable String name) {
        Product product = productService.getProductWithPrices(name);
        return ResponseEntity.ok(product);
    }
    
    // Additional endpoints for filtering, search, etc.
}
