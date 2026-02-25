package com.namit.categorybackend.product.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private Long productId;

    private String productName;

    private String description;

    private BigDecimal price;

    private String sku;

    private Long categoryId;

    private String categoryName;

    private Integer inventoryCount;

    private Instant createdAt;

    private Instant updatedAt;

    private Boolean status;



}
