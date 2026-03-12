package com.hema.resumematcher.controller;

import com.hema.resumematcher.dto.MatchResult;
import com.hema.resumematcher.entity.Application;
import com.hema.resumematcher.service.ApplicationService;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<MatchResult> apply(@RequestParam Long jobId,
                                             Authentication auth) {
        return ResponseEntity.ok(applicationService.applyToJob(jobId, auth.getName()));
    }

    // ── GET /applications/preview?jobId=1  (CANDIDATE - see score before applying)
    @GetMapping("/preview")
    public ResponseEntity<MatchResult> preview(@RequestParam Long jobId,
                                               Authentication auth) {
        return ResponseEntity.ok(applicationService.previewMatch(jobId, auth.getName()));
    }

    // ── GET /applications/my  (CANDIDATE - my applications) ────────────────
    @GetMapping("/my")
    public ResponseEntity<List<Application>> myApplications(Authentication auth) {
        return ResponseEntity.ok(applicationService.getMyApplications(auth.getName()));
    }

    // ── GET /applications/job/{jobId}  (RECRUITER - ranked applicants) ────────
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> applicantsForJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicantsForJob(jobId));
    }
}

