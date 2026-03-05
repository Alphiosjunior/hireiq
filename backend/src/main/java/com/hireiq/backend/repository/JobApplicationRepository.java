package com.hireiq.backend.repository;

import com.hireiq.backend.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Spring Data JPA gives us all CRUD operations for free
// no need to write any SQL manually
@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {
}