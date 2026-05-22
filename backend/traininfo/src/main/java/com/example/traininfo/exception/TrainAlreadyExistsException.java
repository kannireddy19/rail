package com.example.traininfo.exception;

public class TrainAlreadyExistsException extends RuntimeException {
	private static final long serialVersionUID = 1L;

    public TrainAlreadyExistsException(String message) {
        super(message);
    }
}
