package com.namit.categorybackend.category.specification;

import com.namit.categorybackend.category.entity.Category;
import org.springframework.data.jpa.domain.Specification;

public class CategorySpecification {

    public static Specification<Category> hasStatus(Boolean status){
        return (root, query , cb) -> {
            if(status == null ) return null;
            return cb.equal(root.get("status"), status);
        };
    }
}
