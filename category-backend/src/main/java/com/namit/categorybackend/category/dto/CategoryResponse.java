package com.namit.categorybackend.category.dto;

import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryResponse {

    private Long categoryId;

    private String categoryName;

    private String description;

    private Instant createdAt;

    private Instant updatedAt;

    private Boolean status;


}
