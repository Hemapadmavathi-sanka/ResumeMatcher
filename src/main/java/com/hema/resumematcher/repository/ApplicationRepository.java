package com.hema.resumematcher.repository;

import com.hema.resumematcher.entity.Application;
import com.hema.resumematcher.entity.CandidateProfile;
import com.hema.resumematcher.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByJob(Job job);
    List<Application> findByCandidate(CandidateProfile candidate);
    Optional<Application> findByCandidateAndJob(CandidateProfile candidate, Job job);
    boolean existsByCandidateAndJob(CandidateProfile candidate, Job job);
    List<Application> findByJobOrderByMatchScoreDesc(Job job);
}
