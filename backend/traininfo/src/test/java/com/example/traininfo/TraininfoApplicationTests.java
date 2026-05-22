package com.example.traininfo;

import com.example.traininfo.entity.TrainClass;
import com.example.traininfo.entity.TrainInfo;
import com.example.traininfo.exception.TrainAlreadyExistsException;
import com.example.traininfo.exception.TrainNotFoundException;
import com.example.traininfo.repository.TrainInfoRepository;
import com.example.traininfo.service.TrainInfoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class TraininfoApplicationTests {

    @Mock
    private TrainInfoRepository trainInfoRepository;

    @InjectMocks
    private TrainInfoService trainInfoService;

    private TrainInfo trainInfo;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        // Use HashMap to allow mutation
        Map<TrainClass, Double> priceMap = new HashMap<>();
        priceMap.put(TrainClass.FIRST_AC, 300.0);
        priceMap.put(TrainClass.SECOND_AC, 200.0);
        priceMap.put(TrainClass.THIRD_AC, 150.0);

        trainInfo = TrainInfo.builder()
                .id(1L)
                .trainNumber("12345")
                .trainName("Super Express")
                .source("Chicago")
                .destination("San Francisco")
                .departureDate(LocalDate.now())
                .arrivalDate(LocalDate.now().plusDays(1))
                .departureTime("10:00 AM")
                .arrivalTime("8:00 PM")
                .totalSeats(350)
                .availableSeats(100)
                .classPrices(priceMap)
                .build();
    }

    @Test
    void testAddTrain_Success() {
        when(trainInfoRepository.findByTrainName(trainInfo.getTrainName())).thenReturn(Optional.empty());
        when(trainInfoRepository.save(any(TrainInfo.class))).thenReturn(trainInfo);

        TrainInfo savedTrain = trainInfoService.addTrain(trainInfo);

        assertNotNull(savedTrain);
        assertEquals("Super Express", savedTrain.getTrainName());
        assertEquals("Chicago", savedTrain.getSource());
        assertTrue(savedTrain.getClassPrices().containsKey(TrainClass.THIRD_AC));
        assertEquals(150.0, savedTrain.getClassPrices().get(TrainClass.THIRD_AC));
    }

    @Test
    void testAddTrain_ThrowsException() {
        when(trainInfoRepository.findByTrainName(trainInfo.getTrainName())).thenReturn(Optional.of(trainInfo));

        assertThrows(TrainAlreadyExistsException.class,
                () -> trainInfoService.addTrain(trainInfo));

        verify(trainInfoRepository, never()).save(any(TrainInfo.class));
    }

    @Test
    void testGetAllTrains_Success() {
        when(trainInfoRepository.findAll()).thenReturn(List.of(trainInfo));

        List<TrainInfo> trainList = trainInfoService.getAllTrains();

        assertFalse(trainList.isEmpty());
        assertEquals(1, trainList.size());
        assertEquals("Super Express", trainList.get(0).getTrainName());
    }

    @Test
    void testGetTrainById_Success() throws TrainNotFoundException {
        when(trainInfoRepository.findById(anyLong())).thenReturn(Optional.of(trainInfo));

        TrainInfo foundTrain = trainInfoService.getTrainById(1L);

        assertNotNull(foundTrain);
        assertEquals("Super Express", foundTrain.getTrainName());
    }

    @Test
    void testGetTrainById_ThrowsException() {
        when(trainInfoRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(TrainNotFoundException.class,
                () -> trainInfoService.getTrainById(1L));
    }

    @Test
    void testUpdateTrain_Success() throws TrainNotFoundException {
        when(trainInfoRepository.findById(anyLong())).thenReturn(Optional.of(trainInfo));
        when(trainInfoRepository.save(any(TrainInfo.class))).thenReturn(trainInfo);

        // Mutate the classPrices map safely
        trainInfo.getClassPrices().put(TrainClass.THIRD_AC, 180.0);

        TrainInfo updatedTrain = trainInfoService.updateTrain(1L, trainInfo);

        assertNotNull(updatedTrain);
        assertEquals(180.0, updatedTrain.getClassPrices().get(TrainClass.THIRD_AC));
    }

    @Test
    void testUpdateTrain_ThrowsException() {
        when(trainInfoRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(TrainNotFoundException.class,
                () -> trainInfoService.updateTrain(1L, trainInfo));
    }

    @Test
    void testDeleteTrain_Success() {
        when(trainInfoRepository.existsById(anyLong())).thenReturn(true);
        doNothing().when(trainInfoRepository).deleteById(anyLong());

        assertDoesNotThrow(() -> trainInfoService.deleteTrain(1L));
        verify(trainInfoRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteTrain_ThrowsException() {
        when(trainInfoRepository.existsById(anyLong())).thenReturn(false);

        assertThrows(TrainNotFoundException.class,
                () -> trainInfoService.deleteTrain(1L));

        verify(trainInfoRepository, never()).deleteById(1L);
    }
}
