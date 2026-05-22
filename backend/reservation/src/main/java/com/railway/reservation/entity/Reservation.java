package com.railway.reservation.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String resId;  // New temporary reservation ID

    @Column(unique = true, nullable = true)
    private String pnr;    // Will be null initially

    private Long trainId;
    private Long userId;
    private String trainNumber;
    private String trainName;
    private String source;
    private String destination;
    private String coachType;
    private LocalDateTime departureDateTime;
    private LocalDateTime arrivalDateTime;
    private LocalDateTime bookingDateTime;
    private int numberOfPassengers;
    private double totalFare;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "reservation", orphanRemoval = true)
    private List<Passenger> passengers = new ArrayList<>();

    @PrePersist
    public void generateIds() {
        if (this.resId == null) {
            this.resId = "RES" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        this.bookingDateTime = LocalDateTime.now();
    }

    public void addPassenger(Passenger passenger) {
        passenger.setReservation(this);
        this.passengers.add(passenger);
    }
}