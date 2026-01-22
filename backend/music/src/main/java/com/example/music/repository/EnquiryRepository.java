package com.example.music.repository;

import com.example.music.entity.Enquiry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {
    
    List<Enquiry> findByInquiryFor(String inquiryFor);
    
    List<Enquiry> findByPhoneNumber(String phoneNumber);
    
    List<Enquiry> findAllByOrderByCreatedAtDesc();
}





