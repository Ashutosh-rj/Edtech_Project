package com.edtech.analytics.repository;

import com.edtech.analytics.entity.CourseAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CourseAnalyticsRepository extends JpaRepository<CourseAnalytics, Long> {
    Optional<CourseAnalytics> findByCourseId(Long courseId);
}
