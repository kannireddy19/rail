package com.railway.payment.service;

import com.railway.payment.client.ReservationClient;
import com.railway.payment.dto.PaymentRequestDTO;
import com.railway.payment.dto.PaymentResponseDTO;
import com.railway.payment.entity.Payment;
import com.railway.payment.exception.PaymentNotFoundException;
import com.railway.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationClient reservationClient;

    @Transactional
    public PaymentResponseDTO processPayment(PaymentRequestDTO request) {
        // Verify reservation exists using resId
        reservationClient.getReservationByResId(request.getResId());

        Optional<Payment> existingPaymentOpt = paymentRepository.findByResId(request.getResId());
        Payment payment;
        
        if (existingPaymentOpt.isPresent()) {
            payment = existingPaymentOpt.get();
            if ("SUCCESS".equals(payment.getStatus())) {
                throw new RuntimeException("Payment already processed for resId: " + request.getResId());
            }
            // Update fields for retry
            payment.setAmount(request.getAmount());
            payment.setPaymentMethod(request.getPaymentMethod());
            payment.setStatus("SUCCESS");
        } else {
            payment = new Payment();
            payment.setResId(request.getResId());
            payment.setAmount(request.getAmount());
            payment.setPaymentMethod(request.getPaymentMethod());
            payment.setStatus("SUCCESS");
        }

        // Generate PNR
        String pnr = "PNR" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        payment.setPnr(pnr);

        payment = paymentRepository.save(payment);

        if ("SUCCESS".equals(payment.getStatus())) {
            try {
                reservationClient.confirmPayment(request.getResId(), pnr);
            } catch (Exception e) {
                payment.setStatus("FAILED");
                paymentRepository.save(payment);
                throw new RuntimeException("Failed to confirm reservation: " + e.getMessage());
            }
        }

        return convertToDTO(payment);
    }

    public PaymentResponseDTO getPaymentStatusDetails(String resId) {
        Payment payment = paymentRepository.findByResId(resId)
            .orElseThrow(() -> new PaymentNotFoundException("Payment not found for resId: " + resId));
        return convertToDTO(payment);
    }

    // Keep this for backward compatibility if needed
    public String getPaymentStatus(String resId) {
        Optional<Payment> paymentOpt = paymentRepository.findByResId(resId);
        return paymentOpt.map(Payment::getStatus).orElse("NOT_FOUND");
    }

    private PaymentResponseDTO convertToDTO(Payment payment) {
        PaymentResponseDTO response = new PaymentResponseDTO();
        response.setPaymentId(payment.getPaymentId());
        response.setResId(payment.getResId());
        response.setPnr(payment.getPnr());
        response.setAmount(payment.getAmount());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setStatus(payment.getStatus());
        response.setPaymentTime(payment.getPaymentTime());
        return response;
    }
}