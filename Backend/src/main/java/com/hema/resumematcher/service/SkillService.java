package com.hema.resumematcher.service;

import com.hema.resumematcher.entity.Skill;
import com.hema.resumematcher.repository.SkillRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillService {

    private final SkillRepository skillRepository;

    /**
     * Find or create skills by name (case-insensitive).
     * This ensures "Java" and "java" map to the same DB row.
     */
    private static final Set<String> IGNORED_WORDS = Set.of(
    	    "linkedin", "github", "twitter", "facebook", "instagram",
    	    "email", "phone", "address", "mobile", "www", "http", "https"
    	);

    	public Set<Skill> resolveSkills(Set<String> skillNames) {
    	    return skillNames.stream()
    	            .map(String::trim)
    	            .filter(name -> !name.isEmpty())
    	            .map(String::toLowerCase)
    	            .filter(name -> !IGNORED_WORDS.contains(name))
    	            .distinct()
    	            .map(name -> skillRepository.findByNameIgnoreCase(name)
    	                    .orElseGet(() -> skillRepository.save(
    	                            Skill.builder().name(name).build()
    	                    ))
    	            )
    	            .collect(Collectors.toSet());
    	}
    
}

