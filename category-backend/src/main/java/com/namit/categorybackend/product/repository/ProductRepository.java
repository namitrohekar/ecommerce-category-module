package com.namit.categorybackend.product.repository;

import com.namit.categorybackend.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product ,Long> {

    // For SKU uniqueness check on create
    boolean existsBySku(String sku);

    // For SKU uniqueness checks on update (Exclude self)
    boolean existsBySkuAndProductIdNot(String sku , Long productId);

    // For fetching only active product by ID
    Optional<Product> findByProductIdAndStatusTrue(Long id);

}
