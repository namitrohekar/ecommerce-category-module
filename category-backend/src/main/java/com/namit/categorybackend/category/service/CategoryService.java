package com.namit.categorybackend.category.service;

import com.namit.categorybackend.category.dto.CategoryRequest;
import com.namit.categorybackend.category.dto.CategoryResponse;
import com.namit.categorybackend.common.response.PagedResponse;
import org.springframework.data.domain.Page;


public interface CategoryService {

    // Creates a new category after validating uniqueness
    CategoryResponse createCategory(CategoryRequest request);

    // Gets all categories
    PagedResponse<CategoryResponse> getAllCategories(int page , int size , String status);

    // Retrieves an active category by its ID.
    CategoryResponse getCategoryById(Long id);

    // Updates the category
    CategoryResponse updateCategory(Long id, CategoryRequest request);

    // Performs soft delete by marking category as inactive.
    void deleteCategory(Long id);

    // Toggles the category status (Active <-> Inactive)
    CategoryResponse toggleCategoryStatus(Long id);
}
