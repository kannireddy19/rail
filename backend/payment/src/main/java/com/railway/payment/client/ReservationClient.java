package com.railway.payment.client;

import com.railway.payment.dto.ReservationResponseDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "RESERVATION-SERVICE")
public interface ReservationClient {

    @PostMapping("/reservations/confirm/{resId}")
    void confirmPayment(
            @PathVariable String resId,
            @RequestParam String pnr);

    @GetMapping("/reservations/get-by-resId/{resId}")
    ReservationResponseDTO getReservationByResId(@PathVariable String resId);

    @GetMapping("/reservations/get/{pnr}")
    ReservationResponseDTO getReservationByPnr(@PathVariable String pnr);
}