package com.namit.categorybackend.category.service.impl;

import com.namit.categorybackend.category.dto.CategoryRequest;
import com.namit.categorybackend.category.dto.CategoryResponse;
import com.namit.categorybackend.category.entity.Category;
import com.namit.categorybackend.category.mapper.CategoryMapper;
import com.namit.categorybackend.category.repository.CategoryRepository;
import com.namit.categorybackend.category.service.CategoryService;
import com.namit.categorybackend.common.exception.ResourceAlreadyExistsException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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




}
