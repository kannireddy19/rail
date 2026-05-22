package com.railway.payment.enums;

public enum PaymentMethod {
    RAZOR_PAY;
   
    
    public String getDescription() {
        return switch (this) {
            case RAZOR_PAY -> "RAZORPAY";
          
        };
    }
}