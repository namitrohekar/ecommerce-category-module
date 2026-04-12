import api from "../api/axios";

export const getOrders = (
    page = 0,
    size = 10,
    status = null,
    orderStatus = null,
    customerName = null,
    customerEmail = null
) => {
    const params = new URLSearchParams({ page, size });
    if (status !== null) params.append("status", status);
    if (orderStatus) params.append("orderStatus", orderStatus);
    if (customerName) params.append("customerName", customerName);
    if (customerEmail) params.append("customerEmail", customerEmail);
    return api.get(`/orders?${params.toString()}`);
};

export const getOrderById = (id) => api.get(`/orders/${id}`);

export const placeOrder = (data) => api.post("/orders", data);

export const updateOrderStatus = (id, data) => api.patch(`/orders/${id}/status`, data);

export const cancelOrder = (id) => api.patch(`/orders/${id}/cancel`);
