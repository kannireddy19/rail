package com.railway.reservation.service;

import com.railway.reservation.client.TrainInfoClient;
import com.railway.reservation.dto.ReservationRequestDTO;
import com.railway.reservation.dto.ReservationResponseDTO;
import com.railway.reservation.dto.TrainInfoDTO;
import com.railway.reservation.entity.BookingStatus;
import com.railway.reservation.entity.Passenger;
import com.railway.reservation.entity.Reservation;
import com.railway.reservation.exception.ReservationException;
import com.railway.reservation.repository.ReservationRepository;
import feign.FeignException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private static final Logger logger = Logger.getLogger(ReservationService.class.getName());
    private final ReservationRepository reservationRepository;
    private final TrainInfoClient trainInfoClient;

    @Transactional
    public ReservationResponseDTO createReservation(ReservationRequestDTO request) {
        try {
            List<TrainInfoDTO> trains = trainInfoClient.getAllTrains();
            logger.info("Fetched all trains: " + trains.size());

            LocalDate parsedDepartureDate = LocalDate.parse(request.getDepartureDate());
            logger.info("Parsing Departure Date: " + parsedDepartureDate);

            TrainInfoDTO trainInfo = trains.stream()
                    .filter(train -> train.getSource().equalsIgnoreCase(request.getSource()))
                    .filter(train -> train.getDestination().equalsIgnoreCase(request.getDestination()))
                    .filter(train -> train.getDepartureDate().equals(parsedDepartureDate))
                    .filter(train -> train.getClassPrices() != null && train.getClassPrices().containsKey(request.getCoachType().toUpperCase()))
                    .filter(train -> train.getAvailableSeats() >= request.getPassengers().size())
                    .findFirst()
                    .orElseThrow(() -> new ReservationException("No matching active train found or not enough seats available."));

            double ticketPrice = trainInfo.getClassPrices().get(request.getCoachType().toUpperCase());
            logger.info("Ticket Price: " + ticketPrice);

            LocalTime parsedDepartureTime = tryParseTime(trainInfo.getDepartureTime());
            LocalTime parsedArrivalTime = tryParseTime(trainInfo.getArrivalTime());

            Reservation reservation = new Reservation();
            reservation.setResId(generateResId());  // ✅ Custom format
            reservation.setTrainId(trainInfo.getId());
            reservation.setUserId(request.getUserId());
            reservation.setTrainNumber(trainInfo.getTrainNumber());
            reservation.setTrainName(trainInfo.getTrainName());
            reservation.setSource(trainInfo.getSource());
            reservation.setDestination(trainInfo.getDestination());
            reservation.setCoachType(request.getCoachType().toUpperCase());
            reservation.setDepartureDateTime(LocalDateTime.of(trainInfo.getDepartureDate(), parsedDepartureTime));
            reservation.setArrivalDateTime(LocalDateTime.of(trainInfo.getArrivalDate(), parsedArrivalTime));
            reservation.setNumberOfPassengers(request.getPassengers().size());
            reservation.setTotalFare(ticketPrice * request.getPassengers().size());
            reservation.setStatus(BookingStatus.PENDING);
            reservation.setBookingDateTime(LocalDateTime.now());

            request.getPassengers().forEach(passengerDTO -> {
                Passenger passenger = new Passenger();
                passenger.setName(passengerDTO.getName());
                passenger.setAge(passengerDTO.getAge());
                passenger.setGender(passengerDTO.getGender());
                passenger.setSeatNumber("Not Confirmed");
                reservation.addPassenger(passenger);
            });

            Reservation saved = reservationRepository.save(reservation);
            logger.info("Reservation saved with resId: " + saved.getResId());

            trainInfoClient.decreaseAvailableSeats(trainInfo.getId(), request.getPassengers().size());
            logger.info("Available seats decreased by " + request.getPassengers().size());

            return convertToResponseDTO(saved);
        } catch (FeignException ex) {
            throw new ReservationException("External service error: " + ex.getMessage());
        } catch (Exception e) {
            throw new ReservationException("Error creating reservation: " + e.getMessage());
        }
    }

    private LocalTime tryParseTime(String timeString) {
        List<DateTimeFormatter> formatters = List.of(
            DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH),
            DateTimeFormatter.ofPattern("HH:mm")
        );

        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalTime.parse(timeString.trim(), formatter);
            } catch (Exception ignored) {}
        }

        throw new ReservationException("Invalid time format: " + timeString);
    }

    private String generateResId() {
        String prefix = "RES";
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder sb = new StringBuilder();

        for (int i = 0; i < 7; i++) {
            int index = (int) (Math.random() * characters.length());
            sb.append(characters.charAt(index));
        }

        return prefix + sb.toString();
    }

    public List<ReservationResponseDTO> getAllReservations() {
        return reservationRepository.findAll().stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public List<ReservationResponseDTO> getAllReservationsForUser(Long userId) {
        return reservationRepository.findByUserId(userId).stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    public ReservationResponseDTO getReservationByResId(String resId) {
        return convertToResponseDTO(reservationRepository.findByResId(resId)
                .orElseThrow(() -> new ReservationException("Reservation not found with resId: " + resId)));
    }

    public ReservationResponseDTO getReservationByResIdForUser(String resId, Long userId) {
        return reservationRepository.findByResIdAndUserId(resId, userId)
                .map(this::convertToResponseDTO)
                .orElse(null);
    }

    public ReservationResponseDTO getReservationByPnr(String pnr) {
        return convertToResponseDTO(reservationRepository.findByPnr(pnr)
                .orElseThrow(() -> new ReservationException("Reservation not found with PNR: " + pnr)));
    }

    @Transactional
    public boolean confirmPayment(String resId, String pnr) {
        Reservation reservation = reservationRepository.findByResId(resId)
                .orElseThrow(() -> new ReservationException("Reservation not found"));

        if (reservation.getStatus() == BookingStatus.CONFIRMED) {
            return true;
        }

        reservation.setPnr(pnr);
        reservation.setStatus(BookingStatus.CONFIRMED);

        String coachPrefix = switch (reservation.getCoachType().toUpperCase()) {
            case "SLEEPER" -> "S1";
            case "AC" -> "A1";
            default -> "C1";
        };

        AtomicInteger seatCounter = new AtomicInteger(1);
        reservation.getPassengers().forEach(passenger -> {
            passenger.setSeatNumber(coachPrefix + "-" + seatCounter.getAndIncrement());
        });

        reservationRepository.save(reservation);
        return true;
    }

    @Transactional
    public void deleteReservationByPnr(String pnr) {
        Reservation reservation = reservationRepository.findByPnr(pnr)
                .orElseThrow(() -> new ReservationException("Reservation not found with PNR: " + pnr));
        reservationRepository.delete(reservation);
        trainInfoClient.increaseAvailableSeats(reservation.getTrainId(), reservation.getPassengers().size());
    }

    @Transactional
    public void deleteReservationByResId(String resId) {
        Reservation reservation = reservationRepository.findByResId(resId)
                .orElseThrow(() -> new ReservationException("Reservation not found with resId: " + resId));
        reservationRepository.delete(reservation);
        trainInfoClient.increaseAvailableSeats(reservation.getTrainId(), reservation.getPassengers().size());
    }

    @Transactional
    public boolean deleteReservationByResIdForUser(String resId, Long userId) {
        return reservationRepository.findByResIdAndUserId(resId, userId)
                .map(reservation -> {
                    reservationRepository.delete(reservation);
                    trainInfoClient.increaseAvailableSeats(reservation.getTrainId(), reservation.getPassengers().size());
                    return true;
                }).orElse(false);
    }

    @Transactional
    public boolean deleteReservationByPnrForUser(String pnr, Long userId) {
        return reservationRepository.findByPnrAndUserId(pnr, userId)
                .map(reservation -> {
                    reservationRepository.delete(reservation);
                    trainInfoClient.increaseAvailableSeats(reservation.getTrainId(), reservation.getPassengers().size());
                    return true;
                }).orElse(false);
    }

    private ReservationResponseDTO convertToResponseDTO(Reservation reservation) {
        ReservationResponseDTO response = new ReservationResponseDTO();
        response.setResId(reservation.getResId());
        response.setPnr(reservation.getPnr());
        response.setTrainId(reservation.getTrainId());
        response.setUserId(reservation.getUserId());
        response.setTrainNumber(reservation.getTrainNumber());
        response.setTrainName(reservation.getTrainName());
        response.setSource(reservation.getSource());
        response.setDestination(reservation.getDestination());
        response.setDepartureDateTime(reservation.getDepartureDateTime());
        response.setArrivalDateTime(reservation.getArrivalDateTime());
        response.setNumberOfPassengers(reservation.getNumberOfPassengers());
        response.setTotalFare(reservation.getTotalFare());
        response.setCoachType(reservation.getCoachType());
        response.setBookingDateTime(reservation.getBookingDateTime());
        response.setStatus(reservation.getStatus().name());

        if (reservation.getPassengers() != null) {
            response.setPassengers(reservation.getPassengers().stream()
                    .map(passenger -> {
                        ReservationResponseDTO.PassengerResponseDTO dto = new ReservationResponseDTO.PassengerResponseDTO();
                        dto.setName(passenger.getName());
                        dto.setAge(passenger.getAge());
                        dto.setGender(passenger.getGender());
                        dto.setSeatNumber(passenger.getSeatNumber());
                        return dto;
                    }).collect(Collectors.toList()));
        }

        return response;
    }
}
