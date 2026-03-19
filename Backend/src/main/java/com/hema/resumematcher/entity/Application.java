package com.hema.resumematcher.entity;


import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "applications",
       uniqueConstraints = @UniqueConstraint(columnNames = {"candidate_id", "job_id"}))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private double matchScore;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ApplicationStatus status = ApplicationStatus.APPLIED;

    @Column(updatable = false)
    private LocalDateTime appliedAt;

    @ManyToOne
    @JoinColumn(name = "candidate_id")
    @JsonIgnoreProperties({"skills", "resumeText", "applications"})
    private CandidateProfile candidate;

    @ManyToOne
    @JoinColumn(name = "job_id")
    @JsonIgnoreProperties({"requiredSkills", "applications", "recruiter"})
    private Job job;
    @PrePersist
    protected void onCreate() {
        this.appliedAt = LocalDateTime.now();
    }
}
