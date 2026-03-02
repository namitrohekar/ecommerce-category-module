import api from "../api/axios";

export const getCategories = (page = 0, size = 10, status = "active") =>
    api.get(`/categories?page=${page}&size=${size}&status=${status}`);

export const getCategoryById = (id) => api.get(`/categories/${id}`);

export const createCategory = (data) => api.post("/categories", data);

export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);

export const deleteCategory = (id, reassignCategoryId = null) =>
    api.delete(`/categories/${id}`, {
        data: { reassignCategoryId },
    });

export const toggleCategoryStatus = (id, reassignCategoryId = null) =>
    api.patch(`/categories/${id}/toggle`, { reassignCategoryId });

export const getCategoryProductCount = (id) =>
    api.get(`/categories/${id}/product-count`);
