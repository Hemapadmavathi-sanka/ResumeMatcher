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

    // ── Get my profile ────────────────────────────────────────────────────────
    public CandidateProfile getMyProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return profileRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Profile not found. Please create your profile first."));
    }
}
