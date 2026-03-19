package com.hema.resumematcher.service;

import com.hema.resumematcher.dto.MatchResult;
import com.hema.resumematcher.entity.Application;
import com.hema.resumematcher.entity.ApplicationStatus;
import com.hema.resumematcher.entity.CandidateProfile;
import com.hema.resumematcher.entity.Job;
import com.hema.resumematcher.entity.User;
import com.hema.resumematcher.repository.ApplicationRepository;
import com.hema.resumematcher.repository.CandidateProfileRepository;
import com.hema.resumematcher.repository.JobRepository;
import com.hema.resumematcher.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
    private final NotificationService notificationService;

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

        // Notify recruiter
        notificationService.sendNotification(
            job.getRecruiter().getEmail(),
            "New application for '" + job.getTitle() + "' from " + user.getName(),
            "NEW_APPLICATION"
        );

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

    // ── Candidate: view my applications (paginated) ───────────────────────────
    public Page<Application> getMyApplicationsPaged(String candidateEmail, int page, int size) {
        User user = userRepository.findByEmail(candidateEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        CandidateProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found"));
        return applicationRepository.findByCandidate(profile,
                PageRequest.of(page, size, Sort.by("appliedAt").descending()));
    }

    // ── Recruiter: view applicants for a job (sorted by match score DESC) ─────
    public List<Application> getApplicantsForJob(Long jobId, String recruiterEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));
        
        if (!job.getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("You are not authorized to view applicants for this job");
        }
        
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

    // ── Recruiter: update application status ──────────────────────────────────
    public Application updateStatus(Long applicationId, ApplicationStatus status, String recruiterEmail) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        if (!application.getJob().getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new RuntimeException("You are not authorized to update this application");
        }

        application.setStatus(status);
        Application saved = applicationRepository.save(application);

        // Notify candidate
        notificationService.sendNotification(
            saved.getCandidate().getUser().getEmail(),
            "Your application for '" + saved.getJob().getTitle() + "' is now: " + status,
            "STATUS_UPDATE"
        );

        return saved;
    }
}
