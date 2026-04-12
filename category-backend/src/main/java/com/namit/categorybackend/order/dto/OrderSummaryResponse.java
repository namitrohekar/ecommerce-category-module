package com.namit.categorybackend.order.dto;

import com.namit.categorybackend.order.enums.OrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderSummaryResponse {
    private Long orderId;
    private Long customerId;
    private String customerName;
    private BigDecimal totalAmount;
    private OrderStatus orderStatus;
    private Instant createdAt;
    private Boolean status;
}
