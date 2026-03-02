package com.namit.categorybackend.category.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDeactivateRequest {

    /**
     * Target category ID to reassign products to.
     * If null, products are reassigned to the auto-created "Uncategorized"
     * category.
     */
    private Long reassignCategoryId;
}
