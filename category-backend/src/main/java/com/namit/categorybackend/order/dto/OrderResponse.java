package com.namit.categorybackend.order.dto;

import com.namit.categorybackend.order.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long orderId;

    // Customer info — sourced from the Customer FK, exposed flat for API consumers
    private Long customerId;
    private String customerName;
    private String customerEmail;

    private BigDecimal totalAmount;
    private BigDecimal taxAmount;
    private BigDecimal shippingCost;
    private OrderStatus orderStatus;
    private String shippingAddress;
    private Instant createdAt;
    private Instant updatedAt;
    private Boolean status;
    private List<OrderItemResponse> items;
}
