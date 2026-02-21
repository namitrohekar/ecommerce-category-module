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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

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
    public Page<CategoryResponse> getAllCategories(int page , int size , String status) {

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by("createdAt").descending()
        );

        Boolean statusValue = switch (status.toLowerCase()){
            case "inactive" -> false;
            case "all" -> null;
            default -> true;
        };

        Specification<Category> spec =
                Specification.where(CategorySpecification.hasStatus(statusValue));

        Page<Category> categoryPage = categoryRepository.findAll(spec ,pageable);

        return categoryPage.map(CategoryMapper::toResponse);
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
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findByCategoryIdAndStatusTrue(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));

        category.setStatus(false);

        categoryRepository.save(category);

    }

    @Override
    @Transactional
    public CategoryResponse toggleCategoryStatus(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));

        category.setStatus(!category.getStatus());

        Category savedCategory = categoryRepository.save(category);
        return CategoryMapper.toResponse(savedCategory);
    }
}
