package com.hema.resumematcher.service;

import com.hema.resumematcher.dto.MatchResult;
import com.hema.resumematcher.entity.CandidateProfile;
import com.hema.resumematcher.entity.Job;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * ═══════════════════════════════════════════════════════════════════
 *  AI MATCHING ENGINE  –  Core Feature
 * ═══════════════════════════════════════════════════════════════════
 *
 *  Score Formula:
 *
 *    skillScore     = (matchedSkills / requiredSkills) × 60   → max 60 pts
 *    expScore       = clamp((candidateExp / requiredExp), 0, 1) × 30 → max 30 pts
 *    keywordScore   = (keywordHits / totalKeywords) × 10      → max 10 pts
 *    ─────────────────────────────────────────────────────────
 *    TOTAL          = skillScore + expScore + keywordScore     → max 100 pts
 *
 */
@Service
@RequiredArgsConstructor
public class MatchingService {

    private final GeminiService geminiService;

    private static final double SKILL_WEIGHT   = 60.0;
    private static final double EXP_WEIGHT     = 30.0;
    private static final double KEYWORD_WEIGHT = 10.0;

    /**
     * Calculate full match result between a candidate and a job.
     */
    public MatchResult calculateMatch(CandidateProfile candidate, Job job) {

        // ── 1. Skill Score ────────────────────────────────────────────────────
        Set<String> candidateSkillNames = candidate.getSkills().stream()
                .map(s -> s.getName().toLowerCase())
                .collect(Collectors.toSet());

        Set<String> requiredSkillNames = job.getRequiredSkills().stream()
                .map(s -> s.getName().toLowerCase())
                .collect(Collectors.toSet());

        Set<String> matched = candidateSkillNames.stream()
                .filter(requiredSkillNames::contains)
                .collect(Collectors.toSet());

        Set<String> missing = requiredSkillNames.stream()
                .filter(s -> !candidateSkillNames.contains(s))
                .collect(Collectors.toSet());

        double skillRatio = requiredSkillNames.isEmpty() ? 1.0
                : (double) matched.size() / requiredSkillNames.size();
        double skillScore = skillRatio * SKILL_WEIGHT;

        // ── 2. Experience Score ───────────────────────────────────────────────
        double expRatio = (job.getRequiredExperience() == 0) ? 1.0
                : Math.min(1.0, (double) candidate.getExperience() / job.getRequiredExperience());
        double expScore = expRatio * EXP_WEIGHT;

        // ── 3. Keyword Score (from resume text vs job description) ────────────
        double keywordScore = 0.0;
        if (candidate.getResumeText() != null && !candidate.getResumeText().isBlank()
                && job.getDescription() != null && !job.getDescription().isBlank()) {
            keywordScore = calculateKeywordScore(candidate.getResumeText(), job.getDescription());
        }

        // ── 4. AI Deep Analysis (Phase 3) ────────────────────────────────────
        java.util.Map<String, Object> aiResult = geminiService.analyzeMatch(
            candidate.getResumeText(), job.getDescription()
        );
        
        double aiScore = (double) aiResult.get("score");
        String rationale = (String) aiResult.get("rationale");

        // ── 5. Final Score (Hybrid: AI + Keyword) ────────────────────────────
        // We use a weighted average: 70% AI, 30% Keyword/Experience heuristics
        double heuristicScore = Math.min(100.0, skillScore + expScore + keywordScore);
        double totalScore = (aiScore > 0) ? (aiScore * 0.7 + heuristicScore * 0.3) : heuristicScore;
        totalScore = Math.round(totalScore * 100.0) / 100.0;

        return MatchResult.builder()
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .matchScore(totalScore)
                .matchedSkills(matched)
                .missingSkills(missing)
                .matchRationale(rationale)
                .build();
    }

    /**
     * Simple keyword overlap: count how many job-description words appear in resume.
     * Returns a score 0–10.
     */
    private double calculateKeywordScore(String resumeText, String jobDescription) {
        Set<String> resumeWords = tokenize(resumeText);
        String[] jobWords = jobDescription.toLowerCase().split("\\W+");

        if (jobWords.length == 0) return 0.0;

        long hits = 0;
        for (String word : jobWords) {
            if (word.length() > 3 && resumeWords.contains(word)) { // skip tiny words
                hits++;
            }
        }
        double ratio = (double) hits / jobWords.length;
        return ratio * KEYWORD_WEIGHT;
    }

    private Set<String> tokenize(String text) {
        return new java.util.HashSet<>(
            java.util.Arrays.asList(text.toLowerCase().split("\\W+"))
        );
    }
}
