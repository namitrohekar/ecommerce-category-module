package com.namit.categorybackend.product.service.impl;

import com.namit.categorybackend.category.entity.Category;
import com.namit.categorybackend.category.repository.CategoryRepository;
import com.namit.categorybackend.common.exception.ResourceAlreadyExistsException;
import com.namit.categorybackend.common.exception.ResourceNotFoundException;
import com.namit.categorybackend.common.response.PagedResponse;
import com.namit.categorybackend.product.dto.ProductRequest;
import com.namit.categorybackend.product.dto.ProductResponse;
import com.namit.categorybackend.product.entity.Product;
import com.namit.categorybackend.product.mapper.ProductMapper;
import com.namit.categorybackend.product.repository.ProductRepository;
import com.namit.categorybackend.product.service.ProductService;

import com.namit.categorybackend.product.specification.ProductSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {

        // SKU uniqueness check
        if(productRepository.existsBySku(request.getSku())){
            throw new ResourceAlreadyExistsException(
                    "A product with SKU '" + request.getSku() + "' already exists.");
        }

        // validate category existence
        Category category = categoryRepository.findByCategoryIdAndStatusTrue(request.getCategoryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Active category with ID '" + request.getCategoryId() + "' not found."
                        ));

        Product product = ProductMapper.toEntity(request);

        product.setCategory(category);

        Product savedProduct = productRepository.save(product);
        return ProductMapper.toResponse(savedProduct);
    }



    @Override
    public PagedResponse<ProductResponse> getAllProducts(int page , int size , String status){

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


        Specification<Product> spec = Specification.where(ProductSpecification.hasStatus((statusValue)));

        Page<Product> productPage = productRepository.findAll(spec , pageable);

        Page<ProductResponse> mappedPage = productPage.map(ProductMapper::toResponse);

        return new PagedResponse<>(
                mappedPage.getContent(),
                mappedPage.getNumber(),
                mappedPage.getSize(),
                mappedPage.getTotalElements(),
                mappedPage.getTotalPages()
        );
    }



}
