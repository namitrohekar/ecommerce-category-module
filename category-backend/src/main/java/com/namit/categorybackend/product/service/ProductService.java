package com.namit.categorybackend.product.service;


import com.namit.categorybackend.common.response.PagedResponse;
import com.namit.categorybackend.product.dto.ProductRequest;
import com.namit.categorybackend.product.dto.ProductResponse;

public interface ProductService {

    // Creates a new product
    ProductResponse createProduct(ProductRequest request);

    // Get all products
    PagedResponse<ProductResponse> getAllProducts(int page , int size , String status);
}
