import api from "../api/axios";

export const getProducts = (page = 0, size = 10, status = "active") =>
    api.get(`/products?page=${page}&size=${size}&status=${status}`);

export const getPublicProducts = (page = 0, size = 12) =>
    api.get(`/products/public?page=${page}&size=${size}`);

export const getProductById = (id) => api.get(`/products/${id}`);

export const createProduct = (data) => api.post("/products", data);

export const updateProduct = (id, data) => api.put(`/products/${id}`, data);

export const toggleProductStatus = (id) => api.patch(`/products/${id}/toggle`);
