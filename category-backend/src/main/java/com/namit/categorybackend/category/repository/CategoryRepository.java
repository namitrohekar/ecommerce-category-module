package com.namit.categorybackend.category.repository;

import com.namit.categorybackend.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Boolean existsByCategoryName(String categoryName);

    /*
    * Instead of findall to get all categories we can just get active categories (later we can implement a
    * method where we can get all active and inactive if needed
    * */
    List<Category> findByStatusTrue();

    Optional<Category> findByCategoryIdAndStatusTrue(Long id);

}
