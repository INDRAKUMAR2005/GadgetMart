package com.gadgetmart.product.repository;

import com.gadgetmart.product.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {

    Optional<Product> findByName(String name);

    List<Product> findByCategory(String category);

    List<Product> findByBrand(String brand);

    List<Product> findByVendorEmail(String vendorEmail);

    // Find products whose prices haven't been updated recently (e.g., > 1 hour)
    List<Product> findByLastUpdatedBefore(LocalDateTime cutoff);
}
