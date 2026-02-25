package com.namit.categorybackend.product.entity;


import com.namit.categorybackend.category.entity.Category;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "products")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Long productId;

    @Column(name = "product_name" , length = 150, nullable = false)
    private String productName;

    @Column(length = 500)
    private String description;

    @Column( nullable = false, precision = 10 , scale = 2)
    private BigDecimal price;

    @Column(unique = true , length = 50 , nullable = false)
    private String sku;

    @Column(name = "inventory_count" , nullable = false)
    private Integer inventoryCount;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @Builder.Default
    private Boolean status = true;

    // Relationship with category-module
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id" , nullable = false)
    private Category category;
}
