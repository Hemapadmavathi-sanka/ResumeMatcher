package com.hema.resumematcher.controller;

import com.hema.resumematcher.dto.JobRequest;
import com.hema.resumematcher.entity.Job;
import com.hema.resumematcher.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    // ── POST /jobs/post  (RECRUITER only) ─────────────────────────────────────
    @PostMapping("/post")
    public ResponseEntity<Job> postJob(@Valid @RequestBody JobRequest request,
                                       Authentication auth) {
        return ResponseEntity.ok(jobService.postJob(request, auth.getName()));
    }

    // ── PUT /jobs/update/{id}  (RECRUITER only) ───────────────────────────────
    @PutMapping("/update/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable Long id,
                                         @Valid @RequestBody JobRequest request,
                                         Authentication auth) {
        return ResponseEntity.ok(jobService.updateJob(id, request, auth.getName()));
    }

    // ── DELETE /jobs/delete/{id}  (RECRUITER only) ────────────────────────────
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable Long id,
                                            Authentication auth) {
        return ResponseEntity.ok(jobService.deleteJob(id, auth.getName()));
    }

    // ── GET /jobs  (all authenticated users) ─────────────────────────────────
    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    // ── GET /jobs/{id}  ───────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJob(id));
    }

    // ── GET /jobs/my  (recruiter's own postings) ────────────────────────────
 // ── GET /jobs/my  (recruiter's own postings) ──────────────────────────────
    @GetMapping("/my")
    public ResponseEntity<List<Job>> myJobs2(Authentication auth) {
        return ResponseEntity.ok(jobService.getJobsByRecruiter(auth.getName()));
    }

    // ── GET /jobs/search?keyword=java ────────────────────────────────────────
    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(@RequestParam String keyword) {
        return ResponseEntity.ok(jobService.searchJobs(keyword));
    }
    
}

