package com.namit.categorybackend.common.exception;

import com.namit.categorybackend.common.response.ApiWrapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
/*
* Handles application-wide exceptions and converts them into
* standard API responses.
* */
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceAlreadyExistsException.class)

    public ResponseEntity<ApiWrapper<Object>> handleResourceAlreadyExists(
            ResourceAlreadyExistsException ex){
        ApiWrapper<Object> response = ApiWrapper.builder()
                .status("error")
                .message(ex.getMessage())
                .data(null)
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(ApiWrapper.error(ex.getMessage()));
    }


    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiWrapper<Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .findFirst()
                .orElse("Validation failed");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiWrapper.error(message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiWrapper<Object>> handleGenericException(Exception ex) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiWrapper.error("Something went wrong. Please try again."));
    }



    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiWrapper<Object>> handleResourceNotFound(
            ResourceNotFoundException ex){
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiWrapper.error(ex.getMessage()));
    }
}
