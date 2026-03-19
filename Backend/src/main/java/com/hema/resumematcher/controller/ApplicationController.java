package com.hema.resumematcher.controller;

import com.hema.resumematcher.dto.MatchResult;
import com.hema.resumematcher.entity.Application;
import com.hema.resumematcher.entity.ApplicationStatus;
import com.hema.resumematcher.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    // ── POST /applications/apply?jobId=1  (CANDIDATE) ────────────────────────
    @PostMapping("/apply")
    public ResponseEntity<MatchResult> apply(@RequestParam("jobId") Long jobId,
                                             Authentication auth) {
        return ResponseEntity.ok(applicationService.applyToJob(jobId, auth.getName()));
    }

    // ── GET /applications/preview?jobId=1  (CANDIDATE - see score before applying)
    @GetMapping("/preview")
    public ResponseEntity<MatchResult> preview(@RequestParam("jobId") Long jobId,
                                               Authentication auth) {
        return ResponseEntity.ok(applicationService.previewMatch(jobId, auth.getName()));
    }

    // ── GET /applications/my?page=0&size=10  (CANDIDATE - paginated) ─────────
    @GetMapping("/my")
    public ResponseEntity<Page<Application>> myApplications(
            Authentication auth,
            @RequestParam(name = "page", defaultValue = "0")  int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok(applicationService.getMyApplicationsPaged(auth.getName(), page, size));
    }

    // ── GET /applications/job/{jobId}  (RECRUITER - ranked applicants) ────────
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> applicantsForJob(@PathVariable("jobId") Long jobId, Authentication auth) {
        return ResponseEntity.ok(applicationService.getApplicantsForJob(jobId, auth.getName()));
    }

    // ── PATCH /applications/{id}/status?status=SHORTLISTED ────────────────────
    @PatchMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(
            @PathVariable("id") Long id,
            @RequestParam("status") ApplicationStatus status,
            Authentication auth) {
        return ResponseEntity.ok(applicationService.updateStatus(id, status, auth.getName()));
    }
}

