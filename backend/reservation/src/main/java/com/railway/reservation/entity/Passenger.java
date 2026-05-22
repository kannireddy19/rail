package com.railway.reservation.entity;

import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private int age;
    private String gender;
    private String seatNumber;

    

    @ManyToOne
    @JoinColumn(name = "reservation_id")
    private Reservation reservation;
}
