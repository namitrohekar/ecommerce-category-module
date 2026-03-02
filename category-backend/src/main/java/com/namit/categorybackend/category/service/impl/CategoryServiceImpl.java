package com.namit.categorybackend.category.service.impl;

import com.namit.categorybackend.category.dto.CategoryRequest;
import com.namit.categorybackend.category.dto.CategoryResponse;
import com.namit.categorybackend.category.entity.Category;
import com.namit.categorybackend.category.mapper.CategoryMapper;
import com.namit.categorybackend.category.repository.CategoryRepository;
import com.namit.categorybackend.category.service.CategoryService;
import com.namit.categorybackend.category.specification.CategorySpecification;
import com.namit.categorybackend.common.exception.ResourceAlreadyExistsException;
import com.namit.categorybackend.common.exception.ResourceNotFoundException;
import com.namit.categorybackend.common.response.PagedResponse;
import com.namit.categorybackend.product.entity.Product;
import com.namit.categorybackend.product.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    private static final String UNCATEGORIZED_NAME = "Uncategorized";

    @Override
    public CategoryResponse createCategory(CategoryRequest request) {

        if (categoryRepository.existsByCategoryName((request.getCategoryName()))) {
            throw new ResourceAlreadyExistsException(
                    "Category with name ' " + request.getCategoryName() + " ' already exists");
        }

        Category category = CategoryMapper.toEntity(request);

        Category savedCategory = categoryRepository.save(category);

        return CategoryMapper.toResponse(savedCategory);
    }

    @Override
    public PagedResponse<CategoryResponse> getAllCategories(int page, int size, String status) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending());

        Boolean statusValue = switch (status.toLowerCase()) {
            case "inactive" -> false;
            case "all" -> null;
            default -> true;
        };

        Specification<Category> spec = Specification.where(CategorySpecification.hasStatus(statusValue));

        Page<Category> categoryPage = categoryRepository.findAll(spec, pageable);

        Page<CategoryResponse> mappedPage = categoryPage.map(CategoryMapper::toResponse);

        return new PagedResponse<>(
                mappedPage.getContent(),
                mappedPage.getNumber(),
                mappedPage.getSize(),
                mappedPage.getTotalElements(),
                mappedPage.getTotalPages());
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {

        Category category = categoryRepository
                .findByCategoryIdAndStatusTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));

        return CategoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public CategoryResponse updateCategory(Long id, CategoryRequest request) {

        Category category = categoryRepository.findByCategoryIdAndStatusTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));

        // Check duplicates if name is changing

        if (!category.getCategoryName().equals(request.getCategoryName())
                && categoryRepository.existsByCategoryName(request.getCategoryName())) {

            throw new ResourceAlreadyExistsException(
                    "Category with name '" + request.getCategoryName() + "'  already exists");
        }

        // Update only name and description
        category.setCategoryName(request.getCategoryName());
        category.setDescription(request.getDescription());

        Category updatedCategory = categoryRepository.save(category);

        return CategoryMapper.toResponse(updatedCategory);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id, Long reassignCategoryId) {
        Category category = categoryRepository.findByCategoryIdAndStatusTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));

        // Safeguard: "Uncategorized" cannot be deleted
        if (UNCATEGORIZED_NAME.equalsIgnoreCase(category.getCategoryName())) {
            throw new IllegalStateException("The 'Uncategorized' category cannot be deleted.");
        }

        // Reassign products before deactivating
        reassignProducts(id, reassignCategoryId);

        category.setStatus(false);
        categoryRepository.save(category);
    }

    @Override
    @Transactional
    public CategoryResponse toggleCategoryStatus(Long id, Long reassignCategoryId) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));

        // Safeguard: "Uncategorized" cannot be deactivated
        if (category.getStatus() && UNCATEGORIZED_NAME.equalsIgnoreCase(category.getCategoryName())) {
            throw new IllegalStateException("The 'Uncategorized' category cannot be deactivated.");
        }

        // When deactivating (true -> false), reassign products
        if (category.getStatus()) {
            reassignProducts(id, reassignCategoryId);
        }

        category.setStatus(!category.getStatus());

        Category savedCategory = categoryRepository.save(category);
        return CategoryMapper.toResponse(savedCategory);
    }

    @Override
    public long getProductCount(Long categoryId) {
        return productRepository.countByCategoryCategoryId(categoryId);
    }

    //  Private helper methods

    /**
     * Finds or creates the "Uncategorized" category.
     * Always ensures it is active.
     */
    private Category getOrCreateUncategorized() {
        return categoryRepository.findByCategoryName(UNCATEGORIZED_NAME)
                .map(cat -> {
                    // Ensure it stays active
                    if (!cat.getStatus()) {
                        cat.setStatus(true);
                        return categoryRepository.save(cat);
                    }
                    return cat;
                })
                .orElseGet(() -> {
                    Category uncategorized = Category.builder()
                            .categoryName(UNCATEGORIZED_NAME)
                            .description("Default category for reassigned products")
                            .status(true)
                            .build();
                    return categoryRepository.save(uncategorized);
                });
    }

    /**
     * Reassigns all products from one category to another.
     * If reassignCategoryId is null, products go to "Uncategorized".
     * Validates target category exists, is active, and is not the source category.
     */
    private void reassignProducts(Long fromCategoryId, Long reassignCategoryId) {
        List<Product> products = productRepository.findByCategoryCategoryId(fromCategoryId);
        if (products.isEmpty()) {
            return; // Nothing to reassign
        }

        Category targetCategory;

        if (reassignCategoryId == null) {
            targetCategory = getOrCreateUncategorized();
        } else {
            // Prevent self-reassignment
            if (reassignCategoryId.equals(fromCategoryId)) {
                throw new IllegalArgumentException("Cannot reassign products to the same category being deactivated.");
            }

            targetCategory = categoryRepository.findByCategoryIdAndStatusTrue(reassignCategoryId)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Target category with ID '" + reassignCategoryId + "' not found or is inactive."));
        }

        products.forEach(product -> product.setCategory(targetCategory));
        productRepository.saveAll(products);
    }
}
