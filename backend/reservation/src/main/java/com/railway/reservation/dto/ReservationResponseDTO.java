package com.railway.reservation.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReservationResponseDTO {
    private String resId;  // New field
    private String pnr;
    private Long trainId;
    private Long userId;
    private String trainNumber;
    private String trainName;
    private String source;
    private String destination;
    private LocalDateTime departureDateTime;
    private LocalDateTime arrivalDateTime;
    private int numberOfPassengers;
    private double totalFare;
    private String status;
    private String coachType;
    private LocalDateTime bookingDateTime;
    private List<PassengerResponseDTO> passengers;

    @Data
    public static class PassengerResponseDTO {
        private String name;
        private int age;
        private String gender;
        private String seatNumber;
    }
}