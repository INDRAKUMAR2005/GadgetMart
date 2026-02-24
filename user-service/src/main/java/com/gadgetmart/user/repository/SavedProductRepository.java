package com.gadgetmart.user.repository;

import com.gadgetmart.user.model.SavedProduct;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SavedProductRepository extends JpaRepository<SavedProduct, Long> {
    List<SavedProduct> findByUserEmail(String userEmail);

    Optional<SavedProduct> findByUserEmailAndProductName(String userEmail, String productName);

    void deleteByUserEmailAndProductName(String userEmail, String productName);
}
