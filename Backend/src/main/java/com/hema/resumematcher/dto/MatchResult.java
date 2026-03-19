package com.hema.resumematcher.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class MatchResult {
    private Long jobId;
    private String jobTitle;
    private double matchScore;         // 0 – 100
    private Set<String> matchedSkills;
    private Set<String> missingSkills;
    private String matchRationale;    // AI-generated reasoning
}
