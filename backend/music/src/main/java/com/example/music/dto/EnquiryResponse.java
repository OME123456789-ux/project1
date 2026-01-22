package com.example.music.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnquiryResponse {
    private Long id;
    private String name;
    private String phoneNumber;
    private String inquiryFor;
    private String otherReason;
    private LocalDateTime createdAt;
    private String message;
}





