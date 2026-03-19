package com.hema.resumematcher.controller;

import com.hema.resumematcher.dto.JobRequest;
import com.hema.resumematcher.entity.Job;
import com.hema.resumematcher.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
    public ResponseEntity<Job> updateJob(@PathVariable("id") Long id,
                                         @Valid @RequestBody JobRequest request,
                                         Authentication auth) {
        return ResponseEntity.ok(jobService.updateJob(id, request, auth.getName()));
    }

    // ── DELETE /jobs/delete/{id}  (RECRUITER only) ────────────────────────────
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteJob(@PathVariable("id") Long id,
                                            Authentication auth) {
        return ResponseEntity.ok(jobService.deleteJob(id, auth.getName()));
    }

    // ── GET /jobs?page=0&size=10&title=...&company=...&maxExp=...  ─────────────
    @GetMapping
    public ResponseEntity<Page<Job>> getAllJobs(
            @RequestParam(name = "title", required = false)   String title,
            @RequestParam(name = "company", required = false) String company,
            @RequestParam(name = "maxExp", required = false)  Integer maxExp,
            @RequestParam(name = "page", defaultValue = "0")  int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok(jobService.getAllJobsPaged(title, company, maxExp, page, size));
    }

    // ── GET /jobs/{id}  ───────────────────────────────────────────────────────
    @GetMapping("/{id}")
    public ResponseEntity<Job> getJob(@PathVariable("id") Long id) {
        return ResponseEntity.ok(jobService.getJob(id));
    }

    // ── GET /jobs/my  (recruiter's own postings) ────────────────────────────
 // ── GET /jobs/my  (recruiter's own postings) ──────────────────────────────
    @GetMapping("/my")
    public ResponseEntity<List<Job>> myJobs(Authentication auth) {
        return ResponseEntity.ok(jobService.getJobsByRecruiter(auth.getName()));
    }

    // ── GET /jobs/my/paged  (recruiter's own postings, paginated) ─────────────
    @GetMapping("/my/paged")
    public ResponseEntity<Page<Job>> myJobsPaged(
            Authentication auth,
            @RequestParam(name = "page", defaultValue = "0")  int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok(jobService.getJobsByRecruiterPaged(auth.getName(), page, size));
    }

    // ── GET /jobs/search?keyword=java ────────────────────────────────────────
    @GetMapping("/search")
    public ResponseEntity<List<Job>> searchJobs(@RequestParam("keyword") String keyword) {
        return ResponseEntity.ok(jobService.searchJobs(keyword));
    }
    
}

