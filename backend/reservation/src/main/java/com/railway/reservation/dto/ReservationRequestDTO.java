package com.railway.reservation.dto;

import lombok.Data;
import java.util.List;

@Data
public class ReservationRequestDTO {
    private String source;
    private String destination;
    private String departureDate;
    private String coachType;
    private List<PassengerDTO> passengers;
    private Long userId;

    @Data
    public static class PassengerDTO {
        private String name;
        private int age;
        private String gender;
        private String seatPreference;
    }
}