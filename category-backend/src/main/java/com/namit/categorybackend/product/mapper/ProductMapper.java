package com.namit.categorybackend.product.mapper;

import com.namit.categorybackend.product.dto.ProductRequest;
import com.namit.categorybackend.product.dto.ProductResponse;
import com.namit.categorybackend.product.dto.ProductSummaryResponse;
import com.namit.categorybackend.product.entity.Product;



public class ProductMapper {

    public static Product toEntity(ProductRequest request){

        return Product.builder().
                productName(request.getProductName())
                        .description(request.getDescription())
                                .price((request.getPrice()))
                                        .sku(request.getSku())
                                                .inventoryCount(request.getInventoryCount())


                .build();
    }

    public static ProductResponse toResponse(Product product){
        return ProductResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .description(product.getDescription())
                .price(product.getPrice())
                .sku(product.getSku())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .inventoryCount(product.getInventoryCount())
                .status(product.getStatus())
                .categoryId(product.getCategory().getCategoryId())
                .categoryName(product.getCategory().getCategoryName())
                .build();

    }


    public static ProductSummaryResponse toSummarizedResponse(Product product){

        return ProductSummaryResponse.builder()
                .productId(product.getProductId())
                .productName(product.getProductName())
                .price(product.getPrice())
                .sku(product.getSku())
                .inventoryCount(product.getInventoryCount())
                .status(product.getStatus())
                .categoryName(product.getCategory().getCategoryName())
                .build();
    }
}
