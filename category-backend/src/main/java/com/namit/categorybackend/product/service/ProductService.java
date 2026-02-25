package com.namit.categorybackend.product.service;


import com.namit.categorybackend.product.dto.ProductRequest;
import com.namit.categorybackend.product.dto.ProductResponse;

public interface ProductService {

    ProductResponse createProduct(ProductRequest request);
}
