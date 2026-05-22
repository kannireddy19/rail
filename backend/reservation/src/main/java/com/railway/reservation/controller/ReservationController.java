package com.railway.reservation.controller;

import com.railway.reservation.dto.ReservationRequestDTO;
import com.railway.reservation.dto.ReservationResponseDTO;
import com.railway.reservation.security.JwtUtil;
import com.railway.reservation.service.ReservationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.railway.reservation.exception.ReservationException;

import java.util.List;

@RestController
@RequestMapping("/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/create")
    public ResponseEntity<ReservationResponseDTO> createReservation(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ReservationRequestDTO request) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractClaims(token).get("userId", Long.class);
        request.setUserId(userId);
        ReservationResponseDTO response = reservationService.createReservation(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ReservationResponseDTO>> getAllReservations(
            @RequestHeader("Authorization") String authHeader) {
        String token = authHeader.substring(7);
        Long userId = jwtUtil.extractClaims(token).get("userId", Long.class);
        List<ReservationResponseDTO> responses = reservationService.getAllReservationsForUser(userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/get-by-resId/{resId}")
    public ResponseEntity<ReservationResponseDTO> getReservationByResId(@PathVariable String resId) {
        ReservationResponseDTO response = reservationService.getReservationByResId(resId);
        return response != null
                ? ResponseEntity.ok(response)
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/get-by-pnr/{pnr}")
    public ResponseEntity<ReservationResponseDTO> getReservationByPnr(@PathVariable String pnr) {
        try {
            ReservationResponseDTO response = reservationService.getReservationByPnr(pnr);
            return ResponseEntity.ok(response);
        } catch (ReservationException ex) {
            return ResponseEntity.status(404).body(null);
        }
    }

    @PostMapping("/confirm/{resId}")
    public ResponseEntity<Void> confirmPayment(
            @PathVariable String resId,
            @RequestParam String pnr) {
        boolean confirmed = reservationService.confirmPayment(resId, pnr);
        return confirmed ? ResponseEntity.ok().build() : ResponseEntity.status(403).build();
    }

    @DeleteMapping("/delete-by-pnr/{pnr}")
    public ResponseEntity<String> deleteReservationByPnr(@PathVariable String pnr) {
        try {
            reservationService.deleteReservationByPnr(pnr);
            return ResponseEntity.ok("Reservation with PNR " + pnr + " deleted successfully");
        } catch (ReservationException ex) {
            return ResponseEntity.status(404).body(ex.getMessage());
        }
    }

    @DeleteMapping("/delete-by-resId/{resId}")
    public ResponseEntity<String> deleteReservationByResId(@PathVariable String resId) {
        try {
            reservationService.deleteReservationByResId(resId);
            return ResponseEntity.ok("Reservation with ID " + resId + " deleted successfully");
        } catch (ReservationException ex) {
            return ResponseEntity.status(404).body(ex.getMessage());
        }
    }
}
