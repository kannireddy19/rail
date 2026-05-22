package com.example.traininfo.service;

import com.example.traininfo.entity.TrainInfo;
import com.example.traininfo.exception.TrainAlreadyExistsException;
import com.example.traininfo.exception.TrainNotFoundException;
import com.example.traininfo.repository.TrainInfoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class TrainInfoService {

    private final TrainInfoRepository trainInfoRepository;

    // Add Train
    public TrainInfo addTrain(TrainInfo trainInfo) {
        trainInfoRepository.findByTrainName(trainInfo.getTrainName())
                .ifPresent(existingTrain -> {
                    throw new TrainAlreadyExistsException(
                            "Train with name '" + trainInfo.getTrainName() + "' already exists."
                    );
                });

        // Optional: Validate at least one class with price
        if (trainInfo.getClassPrices() == null || trainInfo.getClassPrices().isEmpty()) {
            throw new IllegalArgumentException("At least one train class with price must be provided.");
        }

        return trainInfoRepository.save(trainInfo);
    }

    // Get All Trains
    public List<TrainInfo> getAllTrains() {
        return trainInfoRepository.findAll();
    }

    // Get Train by ID
    public TrainInfo getTrainById(Long id) throws TrainNotFoundException {
        return trainInfoRepository.findById(id)
                .orElseThrow(() -> new TrainNotFoundException("Train with ID " + id + " not found."));
    }

    // Update Train
    public TrainInfo updateTrain(Long id, TrainInfo updatedTrainInfo) throws TrainNotFoundException {
        TrainInfo existingTrain = getTrainById(id);

        existingTrain.setTrainName(updatedTrainInfo.getTrainName());
        existingTrain.setSource(updatedTrainInfo.getSource());
        existingTrain.setDestination(updatedTrainInfo.getDestination());
        existingTrain.setDepartureTime(updatedTrainInfo.getDepartureTime());
        existingTrain.setArrivalTime(updatedTrainInfo.getArrivalTime());
        existingTrain.setDepartureDate(updatedTrainInfo.getDepartureDate());
        existingTrain.setArrivalDate(updatedTrainInfo.getArrivalDate());
        existingTrain.setTotalSeats(updatedTrainInfo.getTotalSeats());
        existingTrain.setAvailableSeats(updatedTrainInfo.getAvailableSeats());
        //existingTrain.setRunningDays(updatedTrainInfo.getRunningDays());

        // ✅ UPDATED: Set class-wise prices
        existingTrain.setClassPrices(updatedTrainInfo.getClassPrices());

        return trainInfoRepository.save(existingTrain);
    }

    // Delete Train
    public void deleteTrain(Long id) throws TrainNotFoundException {
        if (!trainInfoRepository.existsById(id)) {
            throw new TrainNotFoundException("Train with ID " + id + " not found.");
        }
        trainInfoRepository.deleteById(id);
    }

    // Search Trains
    public List<TrainInfo> searchTrains(String source, String destination) throws TrainNotFoundException {
        List<TrainInfo> trains = trainInfoRepository.findBySourceAndDestination(
                source.trim(),
                destination.trim()
        );

        if (trains.isEmpty()) {
            throw new TrainNotFoundException("No trains found from " + source + " to " + destination);
        }

        return trains;
    }

    // Decrease available seats
    public void decreaseAvailableSeats(Long trainId, int count) {
        TrainInfo train = trainInfoRepository.findById(trainId)
                .orElseThrow(() -> new TrainNotFoundException("Train not found with ID: " + trainId));

        if (train.getAvailableSeats() < count) {
            throw new IllegalArgumentException("Not enough seats available.");
        }

        train.setAvailableSeats(train.getAvailableSeats() - count);
        trainInfoRepository.save(train);
    }
 // Increase available seats
    public void increaseAvailableSeats(Long trainId, int count) {
        TrainInfo train = trainInfoRepository.findById(trainId)
                .orElseThrow(() -> new TrainNotFoundException("Train not found with ID: " + trainId));

        train.setAvailableSeats(train.getAvailableSeats() + count);
        trainInfoRepository.save(train);
    }

}
