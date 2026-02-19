package com.namit.categorybackend.category.mapper;

import com.namit.categorybackend.category.dto.CategoryRequest;
import com.namit.categorybackend.category.dto.CategoryResponse;
import com.namit.categorybackend.category.entity.Category;

public class CategoryMapper {

    public static Category toEntity(CategoryRequest request){

        return Category.builder().
                categoryName(request.getCategoryName())
                .description(request.getDescription())
                .build();
    }


    public static CategoryResponse toResponse(Category category){
        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .status(category.getStatus())
                .build();

    }
}
