package com.namit.categorybackend.product.service;


import com.namit.categorybackend.common.response.PagedResponse;
import com.namit.categorybackend.product.dto.ProductRequest;
import com.namit.categorybackend.product.dto.ProductResponse;
import com.namit.categorybackend.product.entity.Product;

public interface ProductService {

    // Creates a new product
    ProductResponse createProduct(ProductRequest request);

    // Get all products
    PagedResponse<ProductResponse> getAllProducts(int page , int size , String status);

    // Get product by ID
    ProductResponse getProductById( Long id);

    // Toggle product staus (Active <-> Inactive)
    ProductResponse toggleProductStatus(Long id);

    // Update Product
    ProductResponse updateProduct(Long id , ProductRequest request);
}
