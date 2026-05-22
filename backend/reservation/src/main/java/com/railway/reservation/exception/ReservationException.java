// ReservationException.java
package com.railway.reservation.exception;

public class ReservationException extends RuntimeException {
    private static final long serialVersionUID = 1L;
    
    public ReservationException(String message) {
        super(message);
    }
}