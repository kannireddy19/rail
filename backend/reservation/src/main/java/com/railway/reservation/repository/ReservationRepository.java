package com.railway.reservation.repository;

import com.railway.reservation.entity.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByPnr(String pnr);
    Optional<Reservation> findByResId(String resId);

    // ✅ New methods for user-specific access
    List<Reservation> findByUserId(Long userId);
    Optional<Reservation> findByResIdAndUserId(String resId, Long userId);
    Optional<Reservation> findByPnrAndUserId(String pnr, Long userId);
}
