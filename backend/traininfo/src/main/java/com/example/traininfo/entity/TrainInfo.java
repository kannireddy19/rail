package com.example.traininfo.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.Map;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "train_info")
public class TrainInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String trainNumber;

    @Column(nullable = false, unique = true)
    private String trainName;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private String departureTime;

    @Column(nullable = false)
    private String arrivalTime;

    @Column(nullable = false)
    private LocalDate departureDate;

    @Column(nullable = false)
    private LocalDate arrivalDate;

    @Column(nullable = false)
    private int totalSeats;

    @Builder.Default
    @Column(nullable = false)
    private int availableSeats = 0;

    // ✅ UPDATED: Map of TrainClass -> Ticket Price
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "train_class_prices", joinColumns = @JoinColumn(name = "train_id"))
    @MapKeyEnumerated(EnumType.STRING) // ✅ Correct way to store enum keys as strings
    @MapKeyColumn(name = "class_name")
    @Column(name = "ticket_price")
    private Map<TrainClass, Double> classPrices;



  
}
