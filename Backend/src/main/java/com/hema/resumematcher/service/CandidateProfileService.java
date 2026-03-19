package com.hema.resumematcher.service;

import com.hema.resumematcher.dto.CandidateProfileRequest;
import com.hema.resumematcher.entity.CandidateProfile;
import com.hema.resumematcher.entity.Skill;
import com.hema.resumematcher.entity.User;
import com.hema.resumematcher.repository.CandidateProfileRepository;
import com.hema.resumematcher.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class CandidateProfileService {

    private final CandidateProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final SkillService skillService;
    private final FileUploadService fileUploadService;
    private final ResumeParsingService resumeParsingService;

    // ── Create or update profile ──────────────────────────────────────────────
    public CandidateProfile saveProfile(CandidateProfileRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Set<Skill> skills = skillService.resolveSkills(request.getSkillNames());

        CandidateProfile profile = profileRepository.findByUser(user)
                .orElse(CandidateProfile.builder().user(user).build());

        profile.setEducation(request.getEducation());
        profile.setExperience(request.getExperience());
        profile.setResumeText(request.getResumeText());
        profile.setSkills(skills);

        return profileRepository.save(profile);
    }

    // ── Upload and parse resume ──────────────────────────────────────────────
    public CandidateProfile uploadResume(org.springframework.web.multipart.MultipartFile file, String email) throws java.io.IOException, org.apache.tika.exception.TikaException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CandidateProfile profile = profileRepository.findByUser(user)
                .orElse(CandidateProfile.builder().user(user).build());

        // 1. Store the file in 'resumes' subfolder
        String fileName = fileUploadService.storeFile(file, "resumes");
        String filePath = java.nio.file.Paths.get("uploads", "resumes", fileName).toString();
        
        // 2. Extract text
        String extractedText = resumeParsingService.extractText(file);

        // 3. Update profile
        profile.setResumeFileName(file.getOriginalFilename());
        profile.setResumeFilePath(filePath);
        profile.setResumeText(extractedText);

        return profileRepository.save(profile);
    }

    // ── Upload profile photo ──────────────────────────────────────────────────
    public CandidateProfile uploadPhoto(org.springframework.web.multipart.MultipartFile file, String email) throws java.io.IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CandidateProfile profile = profileRepository.findByUser(user)
                .orElse(CandidateProfile.builder().user(user).build());

        // 1. Store the file in 'photos' subfolder
        String fileName = fileUploadService.storeFile(file, "photos");
        
        // 2. Update profile with the web-accessible URL
        profile.setProfilePictureUrl("/uploads/photos/" + fileName);

        return profileRepository.save(profile);
    }

    // ── Get my profile ────────────────────────────────────────────────────────
    public CandidateProfile getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found. Please create your profile first."));
    }
}
