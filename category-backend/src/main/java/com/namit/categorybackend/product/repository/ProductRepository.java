package com.namit.categorybackend.product.repository;

import com.namit.categorybackend.product.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    // For SKU uniqueness check on create
    boolean existsBySku(String sku);

    // For SKU uniqueness checks on update (Exclude self)
    boolean existsBySkuAndProductIdNot(String sku, Long productId);

    // For fetching only active product by ID
    Optional<Product> findByProductIdAndStatusTrue(Long id);

    // Override to eagerly fetch category in a single JOIN query (prevents N+1)
    @EntityGraph(attributePaths = { "category" })
    Page<Product> findAll(Specification<Product> spec, Pageable pageable);

}
