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
import org.springframework.data.domain.Page;
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

    // Get product by ID
    @Operation(summary = "Get product by its id")
    @ApiResponses({
            @ApiResponse(responseCode = "200" , description = "Product retrieved"),
            @ApiResponse(responseCode = "404" , description = "Product not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiWrapper<ProductResponse>> getProductById(
            @PathVariable Long id){

        ProductResponse product = productService.getProductById(id);

        return ResponseEntity.ok(
                ApiWrapper.success("Product fetched successfully" , product));

    }

    // Toggle status
    @Operation(summary = "Toggle product status")
    @ApiResponses({
            @ApiResponse(responseCode = "200" , description = "Product status toggled"),
            @ApiResponse(responseCode = "404" , description = "Product not found")
    })
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<ApiWrapper<ProductResponse>> toggleProductStatus( @PathVariable Long id){
        ProductResponse product = productService.toggleProductStatus(id);

        return ResponseEntity.ok(
                ApiWrapper.success("Product status toggled successfully" , product));
    }



    // Update product

    @Operation(summary = "Update product")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "product updated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation error"),
            @ApiResponse(responseCode = "404", description = "Product not found"),
            @ApiResponse(responseCode = "409", description = "Duplicate SKU name")
    })
    @PutMapping("/{id}")
    public ResponseEntity<ApiWrapper<ProductResponse>> updateProduct(
                                                  @PathVariable Long id ,
                                                 @Valid @RequestBody ProductRequest request){
        ProductResponse response = productService.updateProduct(id,request);

        return ResponseEntity.ok(
                ApiWrapper.success("Product Updated successfully" , response));
    }





}
