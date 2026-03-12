package com.hema.resumematcher.repository;

import com.hema.resumematcher.entity.Job;
import com.hema.resumematcher.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByRecruiter(User recruiter);
    List<Job> findByTitleContainingIgnoreCase(String keyword);
}

