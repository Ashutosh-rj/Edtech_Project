package com.edtech.review.repository;

import com.edtech.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCourseId(Long courseId);
    Optional<Review> findByCourseIdAndStudentId(Long courseId, String studentId);
}
