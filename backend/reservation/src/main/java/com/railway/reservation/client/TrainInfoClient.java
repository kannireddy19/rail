package com.railway.reservation.client;

import com.railway.reservation.dto.TrainInfoDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "traininfo")
public interface TrainInfoClient {

    @GetMapping("/trains/get/{id}")
    TrainInfoDTO getTrainById(@PathVariable Long id);

    @PutMapping("/trains/decrease-seats/{id}") // ✅ FIXED path to match controller
    void decreaseAvailableSeats(@PathVariable Long id, @RequestParam int count);

    @GetMapping("/trains/getall")
    List<TrainInfoDTO> getAllTrains();
    
    @PutMapping("/trains/increase-seats/{id}")
    void increaseAvailableSeats(@PathVariable Long id, @RequestParam int count);

}
