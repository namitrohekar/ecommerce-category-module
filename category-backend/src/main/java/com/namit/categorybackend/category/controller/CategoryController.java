package com.namit.categorybackend.category.controller;

import com.namit.categorybackend.category.dto.CategoryRequest;
import com.namit.categorybackend.category.dto.CategoryResponse;
import com.namit.categorybackend.category.service.CategoryService;
import com.namit.categorybackend.common.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryResponse>> createCategory(
            @Valid @RequestBody CategoryRequest request){

        CategoryResponse response = categoryService.createCategory(request);


        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Category created successfully" , response));

    }


    // Retrieves all active categories.
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getActiveCategories(){
        List<CategoryResponse> categories = categoryService.getActiveCategories();

        return ResponseEntity.ok(
                ApiResponse.success("Categories retrieved successfully" , categories)
        );
    }


    // Retrieves single active category by its id.
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> getCategoryById(
                                                        @PathVariable Long id){
        CategoryResponse response = categoryService.getCategoryById(id);

        return ResponseEntity.ok(
                ApiResponse.success("Category retrieved successfully" , response)
        );
    }

    // Updates an existing category. Validates duplicate name only if name is changed.
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponse>> updateCategory (
                                @PathVariable Long id,
                                @Valid @RequestBody CategoryRequest request){

        CategoryResponse response = categoryService.updateCategory(id ,request);

        return ResponseEntity.ok(
                ApiResponse.success("Category updated successfully" , response)
        );
    }


    @DeleteMapping("/{id}")

    public ResponseEntity<ApiResponse<Object>> deleteCategory(
                        @PathVariable Long id){
        categoryService.deleteCategory(id);

        return ResponseEntity.ok(
                ApiResponse.success("Category deleted successfully" , null)
        );
    }

}
