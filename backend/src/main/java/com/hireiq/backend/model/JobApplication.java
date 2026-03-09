package com.hireiq.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

// this class maps directly to a job_applications table in the database
// JPA will automatically create the table based on these fields
@Entity
@Table(name = "job_applications")
@Data
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String company;
    private String role;
    private String status; // APPLIED, INTERVIEW, OFFER, REJECTED
    private LocalDate appliedDate;

    @Column(columnDefinition = "TEXT")
    private String jobDescription;

    @Column(columnDefinition = "TEXT")
    private String notes;

    // match score returned by our AI service
    private Integer matchScore;
}