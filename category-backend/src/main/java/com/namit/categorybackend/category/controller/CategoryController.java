package com.namit.categorybackend.category.controller;

import com.namit.categorybackend.category.dto.CategoryRequest;
import com.namit.categorybackend.category.dto.CategoryResponse;
import com.namit.categorybackend.category.service.CategoryService;
import com.namit.categorybackend.common.response.ApiWrapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

        private final CategoryService categoryService;

        // Creates a new category.
        @Operation(summary = "Create a new category")
        @ApiResponses({
                        @ApiResponse(responseCode = "201", description = "Category created"),
                        @ApiResponse(responseCode = "400", description = "Validation error"),
                        @ApiResponse(responseCode = "409", description = "Duplicate category name")
        })
        @PostMapping
        public ResponseEntity<ApiWrapper<CategoryResponse>> createCategory(
                        @Valid @RequestBody CategoryRequest request) {

                CategoryResponse response = categoryService.createCategory(request);

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiWrapper.success("Category created successfully", response));

        }

        // Retrieves all categories.
        @Operation(summary = "Retrieve all categories")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Categories retrieved")
        })
        @GetMapping
        public ResponseEntity<ApiWrapper<Page<CategoryResponse>>> getAllCategories(
                @RequestParam(defaultValue = "0") int page,
                @RequestParam(defaultValue = "10") int size,
                @RequestParam(defaultValue = "active") String status
        ) {
                Page<CategoryResponse> categories = categoryService.getAllCategories(page,size,status);

                return ResponseEntity.ok(
                                ApiWrapper.success("Categories retrieved successfully", categories));
        }

        // Retrieves single active category by its id.
        @Operation(summary = "Retrieve category by ID")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Category retrieved"),
                        @ApiResponse(responseCode = "404", description = "Category not found")
        })
        @GetMapping("/{id}")
        public ResponseEntity<ApiWrapper<CategoryResponse>> getCategoryById(
                        @PathVariable Long id) {
                CategoryResponse response = categoryService.getCategoryById(id);

                return ResponseEntity.ok(
                                ApiWrapper.success("Category retrieved successfully", response));
        }

        // Updates an existing category. Validates duplicate name only if name is
        // changed.
        @Operation(summary = "Update category")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Category updated"),
                        @ApiResponse(responseCode = "400", description = "Validation error"),
                        @ApiResponse(responseCode = "404", description = "Category not found"),
                        @ApiResponse(responseCode = "409", description = "Duplicate category name")
        })
        @PutMapping("/{id}")
        public ResponseEntity<ApiWrapper<CategoryResponse>> updateCategory(
                        @PathVariable Long id,
                        @Valid @RequestBody CategoryRequest request) {

                CategoryResponse response = categoryService.updateCategory(id, request);

                return ResponseEntity.ok(
                                ApiWrapper.success("Category updated successfully", response));
        }

        @Operation(summary = "Soft delete category")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Category deleted"),
                        @ApiResponse(responseCode = "404", description = "Category not found")
        })
        @DeleteMapping("/{id}")

        public ResponseEntity<ApiWrapper<Object>> deleteCategory(
                        @PathVariable Long id) {
                categoryService.deleteCategory(id);

                return ResponseEntity.ok(
                                ApiWrapper.success("Category deleted successfully", null));
        }

        @Operation(summary = "Toggle category status")
        @ApiResponses({
                        @ApiResponse(responseCode = "200", description = "Category status toggled"),
                        @ApiResponse(responseCode = "404", description = "Category not found")
        })
        @PatchMapping("/{id}/toggle")
        public ResponseEntity<ApiWrapper<CategoryResponse>> toggleCategoryStatus(
                        @PathVariable Long id) {
                CategoryResponse response = categoryService.toggleCategoryStatus(id);

                return ResponseEntity.ok(
                                ApiWrapper.success("Category status toggled successfully", response));
        }

}
