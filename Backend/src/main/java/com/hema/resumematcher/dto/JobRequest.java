package com.hema.resumematcher.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.util.Set;

@Data
public class JobRequest {
    @NotBlank private String title;
    @NotBlank private String description;
    @NotBlank private String companyName;
    @NotNull  private Integer requiredExperience;
    @NotNull  private Set<String> skillNames; // e.g. ["Java", "Spring Boot", "MySQL"]
}
