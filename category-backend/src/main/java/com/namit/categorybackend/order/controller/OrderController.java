package com.namit.categorybackend.order.controller;

import com.namit.categorybackend.common.response.ApiWrapper;
import com.namit.categorybackend.common.response.PagedResponse;
import com.namit.categorybackend.order.dto.OrderResponse;
import com.namit.categorybackend.order.dto.OrderSummaryResponse;
import com.namit.categorybackend.order.dto.PlaceOrderRequest;
import com.namit.categorybackend.order.dto.UpdateOrderStatusRequest;
import com.namit.categorybackend.order.enums.OrderStatus;
import com.namit.categorybackend.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@Tag(name = "Order Management", description = "APIs for managing orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Place a new order")
    public ResponseEntity<ApiWrapper<OrderResponse>> placeOrder(
            @Valid @RequestBody PlaceOrderRequest request) {
        OrderResponse orderResponse = orderService.placeOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiWrapper.success("Order placed successfully", orderResponse));
    }

    @GetMapping
    @Operation(summary = "Get all orders with pagination and filtering",
            description = "Filter by status (lifecycle flag), orderStatus (business state), customerName (partial), or customerEmail (exact match for My Orders)")
    public ResponseEntity<ApiWrapper<PagedResponse<OrderSummaryResponse>>> getAllOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Boolean status,
            @RequestParam(required = false) OrderStatus orderStatus,
            @RequestParam(required = false) String customerName,
            @RequestParam(required = false) String customerEmail) {

        PagedResponse<OrderSummaryResponse> response =
                orderService.getAllOrders(page, size, status, orderStatus, customerName, customerEmail);
        return ResponseEntity.ok(ApiWrapper.success("Orders retrieved successfully", response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get full order details by ID")
    public ResponseEntity<ApiWrapper<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse response = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiWrapper.success("Order retrieved successfully", response));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Update order status (admin)",
            description = "Valid transitions: PENDING → SHIPPED, SHIPPED → DELIVERED. Cancellation via dedicated endpoint.")
    public ResponseEntity<ApiWrapper<OrderResponse>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        OrderResponse response = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiWrapper.success("Order status updated successfully", response));
    }

    @PatchMapping("/{id}/cancel")
    @Operation(summary = "Cancel an order",
            description = "Only PENDING orders can be cancelled. Automatically restores inventory.")
    public ResponseEntity<ApiWrapper<OrderResponse>> cancelOrder(@PathVariable Long id) {
        OrderResponse response = orderService.cancelOrder(id);
        return ResponseEntity.ok(ApiWrapper.success("Order cancelled successfully", response));
    }
}
