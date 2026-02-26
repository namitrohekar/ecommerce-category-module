package com.namit.categorybackend.product.controller;

import com.namit.categorybackend.common.response.ApiWrapper;
import com.namit.categorybackend.common.response.PagedResponse;
import com.namit.categorybackend.product.dto.ProductRequest;
import com.namit.categorybackend.product.dto.ProductResponse;
import com.namit.categorybackend.product.entity.Product;
import com.namit.categorybackend.product.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // Creates a new product
    @Operation(summary = "Create a new Product")
    @ApiResponses({
            @ApiResponse(responseCode = "201" , description = "Product created" ),
            @ApiResponse(responseCode = "400" , description = "Validation error"),
            @ApiResponse(responseCode = "409" , description = "Duplicate product SKU" )
    })
    @PostMapping()
    public ResponseEntity<ApiWrapper<ProductResponse>> createProduct(
            @Valid @RequestBody ProductRequest request){

        ProductResponse response = productService.createProduct(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiWrapper.success("Product Created Successfully" , response));
    }

    // Gets all active products
    @Operation(summary = "Retrieves all products")
    @ApiResponses({
            @ApiResponse(responseCode = "200" , description = "Products Retrieved successfully")
    })
    @GetMapping
    public ResponseEntity<ApiWrapper<PagedResponse<ProductResponse>>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "active") String status){

        PagedResponse<ProductResponse> product = productService.getAllProducts(page , size , status);

        return ResponseEntity.ok(
                ApiWrapper.success(
                        "Products retrieved successfully" , product));
    }
}
