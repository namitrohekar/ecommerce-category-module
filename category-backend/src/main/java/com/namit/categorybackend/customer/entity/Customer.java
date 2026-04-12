package com.namit.categorybackend.customer.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@Entity
@Table(name = "customers")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "customer_id")
    private Long customerId;

    /**
     * Display name captured at the time of first order.
     * May be updated if the customer places another order with a different name.
     */
    @Column(name = "name", length = 150, nullable = false)
    private String name;

    /**
     * Email is the natural identifier for a guest customer.
     * Unique — returning customers reuse the same customer record.
     */
    @Column(name = "email", length = 200, nullable = false, unique = true)
    private String email;

    @CreatedDate
    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;
}
