package com.railway.payment.dto;

import com.railway.payment.enums.PaymentMethod;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PaymentResponseDTO {
    private String paymentId;
    private String resId;
    private String pnr;
    private Double amount;
    private PaymentMethod paymentMethod;
    private String status;
    private LocalDateTime paymentTime;
}