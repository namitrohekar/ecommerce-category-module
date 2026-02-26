package com.namit.categorybackend.product.specification;

import com.namit.categorybackend.product.entity.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> hasStatus(Boolean status){
        return(root, query, cb) -> {
            if(status == null) return null;
            return cb.equal(root.get("status"),status);
        };
    }
}
