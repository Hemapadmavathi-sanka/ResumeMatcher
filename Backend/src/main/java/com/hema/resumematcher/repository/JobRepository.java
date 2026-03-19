package com.hema.resumematcher.repository;

import com.hema.resumematcher.entity.Job;
import com.hema.resumematcher.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    // Non-paginated (used for recruiter's own jobs - usually small count)
    List<Job> findByRecruiter(User recruiter);
    Page<Job> findByRecruiter(User recruiter, Pageable pageable);
    List<Job> findByTitleContainingIgnoreCase(String keyword);
    // Paginated (used for public job listing)
    Page<Job> findAll(Pageable pageable);

    Page<Job> findByTitleContainingIgnoreCaseAndCompanyNameContainingIgnoreCaseAndRequiredExperienceLessThanEqual(
            String title, String company, int maxExp, Pageable pageable);
}

