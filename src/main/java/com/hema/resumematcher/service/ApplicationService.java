package com.hema.resumematcher.service;

import com.hema.resumematcher.dto.MatchResult;
import com.hema.resumematcher.entity.Application;
import com.hema.resumematcher.entity.CandidateProfile;
import com.hema.resumematcher.entity.Job;
import com.hema.resumematcher.entity.User;
import com.hema.resumematcher.repository.ApplicationRepository;
import com.hema.resumematcher.repository.CandidateProfileRepository;
import com.hema.resumematcher.repository.JobRepository;
import com.hema.resumematcher.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final CandidateProfileRepository profileRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final MatchingService matchingService;

    // ── Apply to a job  (AI score is auto-calculated) ─────────────────────────
    public MatchResult applyToJob(Long jobId, String candidateEmail) {
        User user = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CandidateProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException(
                        "Please create your candidate profile before applying."));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));

        // Prevent duplicate application
        if (applicationRepository.existsByCandidateAndJob(profile, job)) {
            throw new RuntimeException("You have already applied to this job.");
        }

        // ── AI Matching ───────────────────────────────────────────────────────
        MatchResult result = matchingService.calculateMatch(profile, job);

        Application application = Application.builder()
                .candidate(profile)
                .job(job)
                .matchScore(result.getMatchScore())
                .build();

        applicationRepository.save(application);
        return result;
    }

    // ── Candidate: view my applications ──────────────────────────────────────
    public List<Application> getMyApplications(String candidateEmail) {
        User user = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        CandidateProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return applicationRepository.findByCandidate(profile);
    }

    // ── Recruiter: view applicants for a job (sorted by match score DESC) ─────
    public List<Application> getApplicantsForJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));
        return applicationRepository.findByJobOrderByMatchScoreDesc(job);
    }

    // ── Preview match score before applying ───────────────────────────────────
    public MatchResult previewMatch(Long jobId, String candidateEmail) {
        User user = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        CandidateProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        return matchingService.calculateMatch(profile, job);
    }
}
