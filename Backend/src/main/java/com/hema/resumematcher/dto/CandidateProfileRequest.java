package com.hema.resumematcher.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.Set;

@Data
public class CandidateProfileRequest {
    @NotBlank private String education;
    private int experience;           // years
    private String resumeText;        // optional: raw resume text for AI matching
    private Set<String> skillNames;   // e.g. ["Java", "React", "MySQL"]
}
