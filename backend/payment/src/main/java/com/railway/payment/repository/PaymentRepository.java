package com.railway.payment.repository;

import com.railway.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    Optional<Payment> findByPnr(String pnr);
    Optional<Payment> findByResId(String resId);  // Add this method
}