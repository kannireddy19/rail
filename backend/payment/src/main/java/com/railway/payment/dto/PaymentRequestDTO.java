package com.railway.payment.dto;

import com.railway.payment.enums.PaymentMethod;
import lombok.Data;

@Data
public class PaymentRequestDTO {
    private String resId;
    private Double amount;
    private PaymentMethod paymentMethod;
}