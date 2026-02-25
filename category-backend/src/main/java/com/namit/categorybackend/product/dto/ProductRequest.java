package com.namit.categorybackend.product.dto;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductRequest {

    @NotBlank(message = "Product name is required")
    @Size(max = 150 , message = "Product name must be between 10 to 150 characters")
    private String productName;

    @Size(max = 500 , message = "Product description must not exceed 500 characters")
    private String description;

    @NotNull(message = "Price can not be null")
    @DecimalMin("0.01")
    private BigDecimal price;

    @NotBlank(message = "Stock keeping unit can not be blank")
    @Size(max = 50)
    private String sku;

    @NotNull(message = "Product must be associated with a existing category id")
    private Long categoryId;

    @NotNull(message = "Inventory count can not be null")
    @Min(0)
    private Integer inventoryCount;
}
