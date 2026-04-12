package com.namit.categorybackend.order.dto;

import com.namit.categorybackend.order.enums.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateOrderStatusRequest {

    @NotNull(message = "Order status is required")
    private OrderStatus orderStatus; // Must be one of: PENDING, SHIPPED, DELIVERED, CANCELLED
}
