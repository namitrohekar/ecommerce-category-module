package com.namit.categorybackend.order.repository;

import com.namit.categorybackend.order.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long>, JpaSpecificationExecutor<Order> {

    Optional<Order> findByOrderIdAndStatusTrue(Long id);

    @EntityGraph(attributePaths = {"items", "items.product"})
    Page<Order> findAll(Specification<Order> spec, Pageable pageable);

    long countByOrderStatus(String status);
}
