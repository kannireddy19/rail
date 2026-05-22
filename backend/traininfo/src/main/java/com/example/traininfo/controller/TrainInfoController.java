package com.example.traininfo.controller;

import com.example.traininfo.entity.TrainInfo;
import com.example.traininfo.exception.TrainNotFoundException;
import com.example.traininfo.service.TrainInfoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trains")
public class TrainInfoController {

    private final TrainInfoService trainInfoService;

    public TrainInfoController(TrainInfoService trainInfoService) {
        this.trainInfoService = trainInfoService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<TrainInfo> addTrain(@RequestBody TrainInfo trainInfo) {
        return ResponseEntity.ok(trainInfoService.addTrain(trainInfo));
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/getall")
    public ResponseEntity<List<TrainInfo>> getAllTrains() {
        return ResponseEntity.ok(trainInfoService.getAllTrains());
    }

    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @GetMapping("/get/{id}")
    public ResponseEntity<?> getTrainById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(trainInfoService.getTrainById(id));
        } catch (TrainNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateTrain(@PathVariable Long id, @RequestBody TrainInfo trainInfo) {
        try {
            return ResponseEntity.ok(trainInfoService.updateTrain(id, trainInfo));
        } catch (TrainNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTrain(@PathVariable Long id) {
        try {
            trainInfoService.deleteTrain(id);
            return ResponseEntity.ok("Train deleted successfully.");
        } catch (TrainNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/search")
    public ResponseEntity<?> searchTrains(@RequestParam String source, @RequestParam String destination) {
        try {
            return ResponseEntity.ok(trainInfoService.searchTrains(source, destination));
        } catch (TrainNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    // ✅ ADD THIS for reservation-service to decrease seats
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PutMapping("/decrease-seats/{id}")
    public ResponseEntity<String> decreaseSeats(@PathVariable Long id, @RequestParam int count) {
        try {
            trainInfoService.decreaseAvailableSeats(id, count);
            return ResponseEntity.ok("Seats decreased successfully.");
        } catch (TrainNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    @PutMapping("/increase-seats/{id}")
    public ResponseEntity<String> increaseSeats(@PathVariable Long id, @RequestParam int count) {
        try {
            trainInfoService.increaseAvailableSeats(id, count);
            return ResponseEntity.ok("Seats increased successfully.");
        } catch (TrainNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

}
