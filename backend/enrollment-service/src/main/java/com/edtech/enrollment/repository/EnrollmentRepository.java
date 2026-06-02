package com.edtech.enrollment.repository;

import com.edtech.enrollment.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(String studentId);
    Optional<Enrollment> findByStudentIdAndCourseId(String studentId, Long courseId);
}
