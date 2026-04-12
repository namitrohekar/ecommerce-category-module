package com.namit.categorybackend.order.service.impl;

import com.namit.categorybackend.common.exception.InsufficientInventoryException;
import com.namit.categorybackend.common.exception.InvalidOrderStateException;
import com.namit.categorybackend.common.exception.ResourceNotFoundException;
import com.namit.categorybackend.common.response.PagedResponse;
import com.namit.categorybackend.customer.entity.Customer;
import com.namit.categorybackend.customer.repository.CustomerRepository;
import com.namit.categorybackend.order.dto.*;
import com.namit.categorybackend.order.entity.Order;
import com.namit.categorybackend.order.entity.OrderItem;
import com.namit.categorybackend.order.enums.OrderStatus;
import com.namit.categorybackend.order.mapper.OrderMapper;
import com.namit.categorybackend.order.repository.OrderRepository;
import com.namit.categorybackend.order.service.OrderService;
import com.namit.categorybackend.order.specification.OrderSpecification;
import com.namit.categorybackend.product.entity.Product;
import com.namit.categorybackend.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    private static final BigDecimal TAX_RATE = new BigDecimal("0.08");
    private static final BigDecimal FLAT_SHIPPING = new BigDecimal("50.00");

    @Override
    @Transactional
    public OrderResponse placeOrder(PlaceOrderRequest request) {

        /*
         * Find-or-create customer by email.
         * Returning customers reuse the same customer_id — their order history
         * accumulates under one record without requiring authentication.
         * New customers get a fresh Customer row on their first order.
         */
        Customer customer = customerRepository.findByEmail(request.getCustomerEmail())
                .orElseGet(() -> customerRepository.save(
                        Customer.builder()
                                .name(request.getCustomerName())
                                .email(request.getCustomerEmail())
                                .build()
                ));

        Order order = OrderMapper.toEntity(request, customer);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findByProductIdAndStatusTrue(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Product not found with id: " + itemReq.getProductId()));

            if (product.getInventoryCount() < itemReq.getQuantity()) {
                throw new InsufficientInventoryException(
                        "Insufficient inventory for product: " + product.getProductName() +
                        ". Available: " + product.getInventoryCount() + ", Requested: " + itemReq.getQuantity());
            }

            // Deduct inventory atomically within the transaction
            product.setInventoryCount(product.getInventoryCount() - itemReq.getQuantity());
            productRepository.save(product);

            BigDecimal lineTotal = product.getPrice().multiply(new BigDecimal(itemReq.getQuantity()));
            subtotal = subtotal.add(lineTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(product.getPrice())
                    .lineTotal(lineTotal)
                    .build();

            order.getItems().add(orderItem);
        }

        BigDecimal taxAmount = subtotal.multiply(TAX_RATE);
        order.setTaxAmount(taxAmount);
        order.setShippingCost(FLAT_SHIPPING);
        order.setTotalAmount(subtotal.add(taxAmount).add(FLAT_SHIPPING));

        Order savedOrder = orderRepository.save(order);
        return OrderMapper.toResponse(savedOrder);
    }

    @Override
    @Transactional(readOnly = true)
    public PagedResponse<OrderSummaryResponse> getAllOrders(
            int page, int size, Boolean status, OrderStatus orderStatus,
            String customerName, String customerEmail) {

        Specification<Order> spec = Specification
                .where(OrderSpecification.hasStatus(status))
                .and(OrderSpecification.hasOrderStatus(orderStatus))
                .and(OrderSpecification.hasCustomerName(customerName))
                .and(OrderSpecification.hasCustomerEmail(customerEmail));

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Order> orders = orderRepository.findAll(spec, pageable);

        List<OrderSummaryResponse> content = orders.getContent().stream()
                .map(OrderMapper::toSummaryResponse)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                content,
                orders.getNumber(),
                orders.getSize(),
                orders.getTotalElements(),
                orders.getTotalPages()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return OrderMapper.toResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        OrderStatus currentStatus = order.getOrderStatus();
        OrderStatus newStatus = request.getOrderStatus();

        // Guard: terminal states cannot be changed
        if (currentStatus == OrderStatus.CANCELLED || currentStatus == OrderStatus.DELIVERED) {
            throw new InvalidOrderStateException(
                    "Cannot change status from terminal state: " + currentStatus);
        }

        // Enforce valid state machine transitions
        if (currentStatus == OrderStatus.PENDING) {
            if (newStatus != OrderStatus.SHIPPED && newStatus != OrderStatus.CANCELLED) {
                throw new InvalidOrderStateException(
                        "PENDING orders can only move to SHIPPED or CANCELLED, not: " + newStatus);
            }
        } else if (currentStatus == OrderStatus.SHIPPED) {
            if (newStatus != OrderStatus.DELIVERED) {
                throw new InvalidOrderStateException(
                        "SHIPPED orders can only move to DELIVERED, not: " + newStatus);
            }
        }

        // Delegate cancel to canonical method (handles inventory rollback)
        if (newStatus == OrderStatus.CANCELLED) {
            return cancelOrder(id);
        }

        order.setOrderStatus(newStatus);
        return OrderMapper.toResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderResponse cancelOrder(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        if (order.getOrderStatus() != OrderStatus.PENDING) {
            throw new InvalidOrderStateException(
                    "Only PENDING orders can be cancelled. Current status: " + order.getOrderStatus());
        }

        order.setOrderStatus(OrderStatus.CANCELLED);
        order.setStatus(false); // soft-delete: lifecycle visibility = inactive

        // Rollback inventory for every item in the cancelled order
        for (OrderItem item : order.getItems()) {
            Product product = item.getProduct();
            product.setInventoryCount(product.getInventoryCount() + item.getQuantity());
            productRepository.save(product);
        }

        return OrderMapper.toResponse(orderRepository.save(order));
    }
}
