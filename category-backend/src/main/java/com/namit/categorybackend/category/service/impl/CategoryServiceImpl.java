package com.namit.categorybackend.category.service.impl;

import com.namit.categorybackend.category.dto.CategoryRequest;
import com.namit.categorybackend.category.dto.CategoryResponse;
import com.namit.categorybackend.category.entity.Category;
import com.namit.categorybackend.category.mapper.CategoryMapper;
import com.namit.categorybackend.category.repository.CategoryRepository;
import com.namit.categorybackend.category.service.CategoryService;
import com.namit.categorybackend.common.exception.ResourceAlreadyExistsException;
import com.namit.categorybackend.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public CategoryResponse createCategory (CategoryRequest request){

        if(categoryRepository.existsByCategoryName((request.getCategoryName()))){
            throw new ResourceAlreadyExistsException(
                    "Category With name ' " + request.getCategoryName() + " ' already exists"
            );
        }

        Category category = CategoryMapper.toEntity(request);

        Category savedCategory = categoryRepository.save(category);

        return CategoryMapper.toResponse(savedCategory);
    }

    @Override
    public List<CategoryResponse> getActiveCategories() {
        List<Category> categories = categoryRepository.findByStatusTrue();

        return categories.stream()
                .map(CategoryMapper::toResponse)
                .toList();

    }

    @Override
    public CategoryResponse getCategoryById(Long id) {

        Category category = categoryRepository
                .findByCategoryIdAndStatusTrue(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Category not found with id " + id));

        return CategoryMapper.toResponse(category);
    }


}
