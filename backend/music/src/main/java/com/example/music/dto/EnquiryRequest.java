package com.example.music.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EnquiryRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phone;
    
    @NotBlank(message = "Inquiry type is required")
    private String inquiry;
    
    private String otherReason;
}





