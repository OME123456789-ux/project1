package com.example.music.service;

import com.example.music.dto.EnquiryRequest;
import com.example.music.dto.EnquiryResponse;
import com.example.music.entity.Enquiry;
import com.example.music.repository.EnquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnquiryService {
    
    private final EnquiryRepository enquiryRepository;
    
    @Transactional
    public EnquiryResponse submitEnquiry(EnquiryRequest request) {
        // Create new enquiry entity
        Enquiry enquiry = new Enquiry();
        enquiry.setName(request.getName());
        enquiry.setPhoneNumber(request.getPhone());
        enquiry.setInquiryFor(request.getInquiry());
        
        // Set otherReason only if inquiry is "Other"
        if ("Other".equalsIgnoreCase(request.getInquiry()) && request.getOtherReason() != null) {
            enquiry.setOtherReason(request.getOtherReason().trim());
        }
        
        // Save to database
        Enquiry savedEnquiry = enquiryRepository.save(enquiry);
        
        // Create response
        EnquiryResponse response = new EnquiryResponse();
        response.setId(savedEnquiry.getId());
        response.setName(savedEnquiry.getName());
        response.setPhoneNumber(savedEnquiry.getPhoneNumber());
        response.setInquiryFor(savedEnquiry.getInquiryFor());
        response.setOtherReason(savedEnquiry.getOtherReason());
        response.setCreatedAt(savedEnquiry.getCreatedAt());
        response.setMessage("Enquiry submitted successfully!");
        
        return response;
    }
    
    public List<EnquiryResponse> getAllEnquiries() {
        return enquiryRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    public List<EnquiryResponse> getEnquiriesByType(String inquiryType) {
        return enquiryRepository.findByInquiryFor(inquiryType)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    private EnquiryResponse mapToResponse(Enquiry enquiry) {
        EnquiryResponse response = new EnquiryResponse();
        response.setId(enquiry.getId());
        response.setName(enquiry.getName());
        response.setPhoneNumber(enquiry.getPhoneNumber());
        response.setInquiryFor(enquiry.getInquiryFor());
        response.setOtherReason(enquiry.getOtherReason());
        response.setCreatedAt(enquiry.getCreatedAt());
        return response;
    }
}





