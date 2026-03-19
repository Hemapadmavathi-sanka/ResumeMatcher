package com.hema.resumematcher.entity;
import jakarta.persistence.Column;
import jakarta.persistence.*;
import lombok.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "candidate_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CandidateProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String education;

    private int experience;   // years

    @Column(columnDefinition = "LONGTEXT")
    private String resumeText; // extracted resume text for AI matching

    @OneToOne
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    private String resumeFileName;

    private String resumeFilePath;

    private String profilePictureUrl;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "candidate_skills",
        joinColumns = @JoinColumn(name = "candidate_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> skills = new HashSet<>();
}
