package com.railway.payment.entity;

import com.railway.payment.enums.PaymentMethod;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payments")
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String paymentId;

    @Column(nullable = false)
    private String resId;

    @Column(unique = true)
    private String pnr;

    @Column(nullable = false)
    private Double amount;

    @Column(nullable = false)
    private String currency = "INR";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentMethod paymentMethod;

    @Column(nullable = false)
    private String status = "PENDING";

    private String transactionId;
    private String paymentGatewayResponse;
    private String failureReason;
    private String userEmail;

    @Column(nullable = false)
    private LocalDateTime paymentTime;

    @PrePersist
    public void prePersist() {
        if (this.paymentId == null) {
            this.paymentId = "PAY" + System.currentTimeMillis();
        }
        if (this.paymentTime == null) {
            this.paymentTime = LocalDateTime.now();
        }
    }
}