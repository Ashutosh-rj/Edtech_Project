package com.edtech.enrollment.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long courseId;
    private String studentId; // email of the student

    private double progressPercentage;

    /**
     * MED-07: Renamed from `isCompleted` to `completed`.
     *
     * Lombok's @Data with `boolean isCompleted` generates a setter named `setCompleted(boolean)`,
     * stripping the "is" prefix. JPA maps it to an inconsistent column name across providers
     * (`is_completed` vs `completed`). Jackson also serializes it as `completed` (stripping "is"),
     * causing frontend field mismatch. Renaming to `completed` eliminates all ambiguity.
     */
    private boolean completed;

    private LocalDateTime enrolledAt;
    private LocalDateTime lastAccessedAt;

    @PrePersist
    protected void onCreate() {
        enrolledAt = LocalDateTime.now();
        lastAccessedAt = LocalDateTime.now();
        progressPercentage = 0.0;
        completed = false;
    }
}
