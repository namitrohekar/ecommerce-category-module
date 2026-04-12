package com.namit.categorybackend.order.mapper;

import com.namit.categorybackend.customer.entity.Customer;
import com.namit.categorybackend.order.entity.Order;
import com.namit.categorybackend.order.entity.OrderItem;
import com.namit.categorybackend.order.enums.OrderStatus;

import com.namit.categorybackend.order.dto.PlaceOrderRequest;
import com.namit.categorybackend.order.dto.OrderResponse;
import com.namit.categorybackend.order.dto.OrderSummaryResponse;
import com.namit.categorybackend.order.dto.OrderItemResponse;

import java.util.stream.Collectors;

public class OrderMapper {

    /**
     * Builds the Order shell from the request.
     * The Customer is resolved separately in the service (find-or-create by email)
     * and passed in here to keep all persistence concerns in the service layer.
     */
    public static Order toEntity(PlaceOrderRequest request, Customer customer) {
        return Order.builder()
                .customer(customer)
                .shippingAddress(request.getShippingAddress())
                .orderStatus(OrderStatus.PENDING)
                .status(true)
                .build();
    }

    public static OrderResponse toResponse(Order order) {
        Customer customer = order.getCustomer();
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .customerId(customer.getCustomerId())
                .customerName(customer.getName())
                .customerEmail(customer.getEmail())
                .totalAmount(order.getTotalAmount())
                .taxAmount(order.getTaxAmount())
                .shippingCost(order.getShippingCost())
                .orderStatus(order.getOrderStatus())
                .shippingAddress(order.getShippingAddress())
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .status(order.getStatus())
                .items(order.getItems() != null ? order.getItems().stream()
                        .map(OrderMapper::toItemResponse)
                        .collect(Collectors.toList()) : null)
                .build();
    }

    public static OrderSummaryResponse toSummaryResponse(Order order) {
        Customer customer = order.getCustomer();
        return OrderSummaryResponse.builder()
                .orderId(order.getOrderId())
                .customerId(customer.getCustomerId())
                .customerName(customer.getName())
                .totalAmount(order.getTotalAmount())
                .orderStatus(order.getOrderStatus())
                .createdAt(order.getCreatedAt())
                .status(order.getStatus())
                .build();
    }

    public static OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .orderItemId(item.getOrderItemId())
                .productId(item.getProduct().getProductId())
                .productName(item.getProduct().getProductName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .lineTotal(item.getLineTotal())
                .build();
    }
}
