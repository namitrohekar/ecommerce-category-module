package com.namit.categorybackend.order.service;

import com.namit.categorybackend.common.response.PagedResponse;
import com.namit.categorybackend.order.dto.OrderResponse;
import com.namit.categorybackend.order.dto.OrderSummaryResponse;
import com.namit.categorybackend.order.dto.PlaceOrderRequest;
import com.namit.categorybackend.order.dto.UpdateOrderStatusRequest;
import com.namit.categorybackend.order.enums.OrderStatus;

public interface OrderService {
    OrderResponse placeOrder(PlaceOrderRequest request);
    PagedResponse<OrderSummaryResponse> getAllOrders(int page, int size, Boolean status, OrderStatus orderStatus, String customerName, String customerEmail);
    OrderResponse getOrderById(Long id);
    OrderResponse updateOrderStatus(Long id, UpdateOrderStatusRequest request);
    OrderResponse cancelOrder(Long id);
}
