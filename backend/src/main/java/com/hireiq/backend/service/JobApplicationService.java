package com.hireiq.backend.service;

import com.hireiq.backend.model.JobApplication;
import com.hireiq.backend.repository.JobApplicationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// business logic lives here, the controller calls this
// keeping logic out of the controller is standard practice
@Service
public class JobApplicationService {

    private final JobApplicationRepository repository;

    public JobApplicationService(JobApplicationRepository repository) {
        this.repository = repository;
    }

    public List<JobApplication> getAllApplications() {
        return repository.findAll();
    }

    public JobApplication createApplication(JobApplication application) {
        return repository.save(application);
    }

    public Optional<JobApplication> getApplicationById(Long id) {
        return repository.findById(id);
    }

    public JobApplication updateApplication(Long id, JobApplication updated) {
        updated.setId(id);
        return repository.save(updated);
    }

    public void deleteApplication(Long id) {
        repository.deleteById(id);
    }
}