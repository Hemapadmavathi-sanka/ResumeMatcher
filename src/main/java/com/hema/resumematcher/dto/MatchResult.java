package com.hema.resumematcher.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.util.Set;

@Data
@AllArgsConstructor
public class MatchResult {
    private Long jobId;
    private String jobTitle;
    private double matchScore;         // 0 – 100
    private Set<String> matchedSkills;
    private Set<String> missingSkills;
}
