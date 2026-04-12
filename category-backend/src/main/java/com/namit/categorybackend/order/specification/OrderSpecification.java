package com.namit.categorybackend.order.specification;

import com.namit.categorybackend.order.entity.Order;
import com.namit.categorybackend.order.enums.OrderStatus;
import org.springframework.data.jpa.domain.Specification;

public class OrderSpecification {

    /**
     * Filters by lifecycle visibility flag.
     * status=true  → active orders
     * status=false → soft-deleted (cancelled) orders
     * status=null  → all orders (no filter)
     */
    public static Specification<Order> hasStatus(Boolean status) {
        return (root, query, cb) -> {
            if (status == null) return null;
            return cb.equal(root.get("status"), status);
        };
    }

    /**
     * Filters by business state enum.
     * Only valid OrderStatus enum values accepted — invalid values rejected at API level.
     */
    public static Specification<Order> hasOrderStatus(OrderStatus orderStatus) {
        return (root, query, cb) -> {
            if (orderStatus == null) return null;
            return cb.equal(root.get("orderStatus"), orderStatus);
        };
    }

    /**
     * Case-insensitive partial match on customer name.
     * Traverses the customer FK join implicitly.
     */
    public static Specification<Order> hasCustomerName(String customerName) {
        return (root, query, cb) -> {
            if (customerName == null || customerName.isBlank()) return null;
            return cb.like(
                    cb.lower(root.get("customer").get("name")),
                    "%" + customerName.toLowerCase() + "%"
            );
        };
    }

    /**
     * Exact match on customer email (case-insensitive).
     * Used by the frontend to show "My Orders" for a specific customer
     * without requiring authentication.
     */
    public static Specification<Order> hasCustomerEmail(String customerEmail) {
        return (root, query, cb) -> {
            if (customerEmail == null || customerEmail.isBlank()) return null;
            return cb.equal(
                    cb.lower(root.get("customer").get("email")),
                    customerEmail.toLowerCase()
            );
        };
    }
}
