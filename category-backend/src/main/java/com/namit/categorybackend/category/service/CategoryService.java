package com.namit.categorybackend.category.service;

import com.namit.categorybackend.category.dto.CategoryRequest;
import com.namit.categorybackend.category.dto.CategoryResponse;

import java.util.List;
import java.util.Optional;

public interface CategoryService {

    // Creates a new category after validating uniqueness
    CategoryResponse createCategory(CategoryRequest request);

    // Gets all active categories
    List<CategoryResponse> getActiveCategories();

    // Retrieves an active category by its ID.
    CategoryResponse getCategoryById(Long id);

    CategoryResponse updateCategory(Long id , CategoryRequest request);

    // Performs soft delete by marking category as inactive.
    void deleteCategory(Long id);
}
