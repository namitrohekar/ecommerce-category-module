package com.namit.categorybackend.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlaceOrderRequest {

    @NotBlank(message = "Customer name is required")
    private String customerName;

    @Email(message = "Invalid email format")
    private String customerEmail;

    @NotBlank(message = "Shipping address is required")
    @Size(max = 300, message = "Shipping address cannot exceed 300 characters")
    private String shippingAddress;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemRequest> items;
}
