package com.namit.categorybackend.common.response;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder


/*
* Generic Wrapper for API Responses.
* Standard success and error payload structure.
* */

public class ApiWrapper<T> {

    private String status;

    private String message;

    private T data;

    public static <T> ApiWrapper<T> success(String message , T data){
        return ApiWrapper.<T>builder()
                .status("success")
                .message(message)
                .data(data)
                .build();
    }


    public static <T> ApiWrapper<T> error(String message ){
        return ApiWrapper.<T>builder()
                .status("error")
                .message(message)
                .data(null)
                .build();
    }




}
