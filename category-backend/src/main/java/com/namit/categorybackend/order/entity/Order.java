package com.namit.categorybackend.order.entity;

import com.namit.categorybackend.order.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.Instant;

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

    @Column(name = "customer_name" , length = 150 , nullable = false)
    private String customerName;

    @Column(name = "customer_email" , length = 200 , nullable = false)
    private String CustomerEmail;

    @Column(name = "total_amount" , precision = 10 , scale = 2, nullable = false)
    private BigDecimal totalAmount;

    @Column(name = "tax_amount", precision = 10 , scale = 2 , nullable = false)
    private BigDecimal taxAmount;

    @Column(name = "shipping_cost", precision = 10 , scale = 2 ,nullable = false)
    private BigDecimal shippingCost;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status" , length = 50 , nullable = false)
    @Builder.Default
    private OrderStatus orderStatus = OrderStatus.PENDING;


    @Column(name = "shipping_address",length = 300 , nullable = false)
    private String shippingAddress;

    @Column(name = "created_at" ,updatable = false , nullable = false)
    @CreatedDate
    private Instant createdAt;

    @Column(name = "updated_at" , nullable = false)
    @LastModifiedDate
    private Instant updatedAt;

    @Builder.Default
    @Column(name = "status" , nullable = false)
    private Boolean status = true;




}
