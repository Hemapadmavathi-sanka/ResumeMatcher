package com.hema.resumematcher.controller;

import com.hema.resumematcher.dto.CandidateProfileRequest;
import com.hema.resumematcher.entity.CandidateProfile;
import com.hema.resumematcher.service.CandidateProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/candidate")
@RequiredArgsConstructor
public class CandidateProfileController {

    private final CandidateProfileService profileService;

    // ── POST /candidate/profile  (create or update) ───────────────────────────
    @PostMapping("/profile")
    public ResponseEntity<CandidateProfile> saveProfile(
            @Valid @RequestBody CandidateProfileRequest request,
            Authentication auth) {
        return ResponseEntity.ok(profileService.saveProfile(request, auth.getName()));
    }

    // ── POST /candidate/upload-resume  ───────────────────────────────────────
    @PostMapping("/upload-resume")
    public ResponseEntity<CandidateProfile> uploadResume(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            Authentication auth) throws Exception {
        return ResponseEntity.ok(profileService.uploadResume(file, auth.getName()));
    }

    // ── POST /candidate/upload-photo  ────────────────────────────────────────
    @PostMapping("/upload-photo")
    public ResponseEntity<CandidateProfile> uploadPhoto(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            Authentication auth) throws Exception {
        return ResponseEntity.ok(profileService.uploadPhoto(file, auth.getName()));
    }

    // ── GET /candidate/profile  ───────────────────────────────────────────────
    @GetMapping("/profile")
    public ResponseEntity<CandidateProfile> getProfile(Authentication auth) {
        return ResponseEntity.ok(profileService.getMyProfile(auth.getName()));
    }
}

