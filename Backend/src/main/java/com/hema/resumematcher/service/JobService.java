package com.hema.resumematcher.service;

import com.hema.resumematcher.dto.JobRequest;
import com.hema.resumematcher.entity.Job;
import com.hema.resumematcher.entity.Skill;
import com.hema.resumematcher.entity.User;
import com.hema.resumematcher.repository.ApplicationRepository;
import com.hema.resumematcher.repository.JobRepository;
import com.hema.resumematcher.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final SkillService skillService;
    private final ApplicationRepository applicationRepository;

    // ── Post a new job ────────────────────────────────────────────────────────
    public Job postJob(JobRequest request, String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));

        Set<Skill> skills = skillService.resolveSkills(request.getSkillNames());

        Job job = Job.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .companyName(request.getCompanyName())
                .requiredExperience(request.getRequiredExperience())
                .recruiter(recruiter)
                .requiredSkills(skills)
                .build();

        return jobRepository.save(job);
    }

    // ── Update job ────────────────────────────────────────────────────────────
    public Job updateJob(Long jobId, JobRequest request, String recruiterEmail) {
        Job job = getJobOrThrow(jobId);
        validateOwner(job, recruiterEmail);

        Set<Skill> skills = skillService.resolveSkills(request.getSkillNames());
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCompanyName(request.getCompanyName());
        job.setRequiredExperience(request.getRequiredExperience());
        job.setRequiredSkills(skills);

        return jobRepository.save(job);
    }

    // ── Delete job (@Transactional: applications + job deleted atomically) ─────
    @Transactional
    public String deleteJob(Long jobId, String recruiterEmail) {
        Job job = getJobOrThrow(jobId);
        validateOwner(job, recruiterEmail);
        // Delete linked applications first to avoid FK constraint violation
        applicationRepository.findByJob(job).forEach(applicationRepository::delete);
        jobRepository.delete(job);
        return "Job deleted successfully";
    }

    // ── Get all jobs (non-paginated, kept for compatibility) ─────────────────
    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    // ── Get all jobs (paginated with optional filters) ───────────────────────
    public Page<Job> getAllJobsPaged(String title, String company, Integer maxExp, int page, int size) {
        PageRequest pr = PageRequest.of(page, size, Sort.by("id").descending());
        if (title == null) title = "";
        if (company == null) company = "";
        if (maxExp == null) maxExp = 99; // Default to a high experience for "all"

        return jobRepository.findByTitleContainingIgnoreCaseAndCompanyNameContainingIgnoreCaseAndRequiredExperienceLessThanEqual(
                title.trim(), company.trim(), maxExp, pr);
    }

    // ── Get single job ────────────────────────────────────────────────────────
    public Job getJob(Long jobId) {
        return getJobOrThrow(jobId);
    }

    // ── Jobs posted by a recruiter ────────────────────────────────────────────
    public List<Job> getJobsByRecruiter(String email) {
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return jobRepository.findByRecruiter(recruiter);
    }
    
    // ── Jobs posted by a recruiter (paginated) ────────────────────────────────
    public Page<Job> getJobsByRecruiterPaged(String email, int page, int size) {
        User recruiter = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Recruiter not found"));
        return jobRepository.findByRecruiter(recruiter, PageRequest.of(page, size, Sort.by("id").descending()));
    }

    // ── Search jobs by title keyword (deprecated in favor of getAllJobsPaged) ──
    public List<Job> searchJobs(String keyword) {
        return jobRepository.findByTitleContainingIgnoreCase(keyword);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private Job getJobOrThrow(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));
    }

    private void validateOwner(Job job, String email) {
        if (!job.getRecruiter().getEmail().equals(email)) {
            throw new RuntimeException("You are not authorized to modify this job");
        }
        
    }
}
