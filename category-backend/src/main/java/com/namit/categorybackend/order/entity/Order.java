package com.namit.categorybackend.order.entity;

import com.namit.categorybackend.customer.entity.Customer;
import com.namit.categorybackend.order.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    /**
     * Proper FK to customers table — satisfies normalized schema requirement.
     * Set via find-or-create by email so returning customers share one record.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "tax_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal taxAmount;

    @Column(name = "shipping_cost", precision = 10, scale = 2, nullable = false)
    private BigDecimal shippingCost;

    /**
     * orderStatus = business lifecycle state (PENDING → SHIPPED → DELIVERED | CANCELLED).
     * Enforced as enum — invalid states rejected at compile level.
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "order_status", length = 50, nullable = false)
    @Builder.Default
    private OrderStatus orderStatus = OrderStatus.PENDING;

    @Column(name = "shipping_address", length = 300, nullable = false)
    private String shippingAddress;

    @Column(name = "created_at", updatable = false, nullable = false)
    @CreatedDate
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    @LastModifiedDate
    private Instant updatedAt;

    /**
     * status = lifecycle visibility flag (active / soft-deleted).
     * Distinct from orderStatus — set to false only on cancellation.
     */
    @Builder.Default
    @Column(name = "status", nullable = false)
    private Boolean status = true;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<OrderItem> items = new ArrayList<>();
}
