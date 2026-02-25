package com.namit.categorybackend.product.dto;

import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryResponse {

    private Long productId;

    private String productName;

    private BigDecimal price;

    private String sku;

    private String categoryName;

    private Integer inventoryCount;

    private Boolean status;

}