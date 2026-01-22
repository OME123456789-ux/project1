package com.example.music.controller;

import com.example.music.dto.EnquiryRequest;
import com.example.music.dto.EnquiryResponse;
import com.example.music.service.EnquiryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enquiries")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class EnquiryController {
    
    private final EnquiryService enquiryService;
    
    @PostMapping
    public ResponseEntity<EnquiryResponse> submitEnquiry(@Valid @RequestBody EnquiryRequest request) {
        try {
            EnquiryResponse response = enquiryService.submitEnquiry(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            EnquiryResponse errorResponse = new EnquiryResponse();
            errorResponse.setMessage("Error submitting enquiry: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping
    public ResponseEntity<List<EnquiryResponse>> getAllEnquiries() {
        List<EnquiryResponse> enquiries = enquiryService.getAllEnquiries();
        return ResponseEntity.ok(enquiries);
    }
    
    @GetMapping("/type/{inquiryType}")
    public ResponseEntity<List<EnquiryResponse>> getEnquiriesByType(@PathVariable String inquiryType) {
        List<EnquiryResponse> enquiries = enquiryService.getEnquiriesByType(inquiryType);
        return ResponseEntity.ok(enquiries);
    }
    
    @GetMapping("/test")
    public ResponseEntity<String> testConnection() {
        return ResponseEntity.ok("API is working! Backend is connected.");
    }
}

