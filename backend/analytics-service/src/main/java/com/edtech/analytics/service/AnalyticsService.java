package com.edtech.analytics.service;

import com.edtech.analytics.entity.CourseAnalytics;
import com.edtech.analytics.repository.CourseAnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsService {

    @Autowired
    private CourseAnalyticsRepository repository;

    /**
     * HIGH-11: Fixed fragile orElse(new CourseAnalytics(null, ...)) — all-args constructor
     * is positional and breaks if fields are reordered. Now uses orElseGet with explicit
     * field initialization. Returns a transient object (not yet saved) for reads.
     */
    public CourseAnalytics getAnalyticsForCourse(Long courseId) {
        return repository.findByCourseId(courseId).orElseGet(() -> {
            CourseAnalytics empty = new CourseAnalytics();
            empty.setCourseId(courseId);
            empty.setTotalEnrollments(0);
            empty.setCompletedEnrollments(0);
            empty.setAverageRating(0.0);
            empty.setTotalReviews(0);
            return empty;
        });
    }

    /**
     * HIGH-06: Now called by KafkaConsumerService when enrollment events arrive.
     * Uses findOrCreate pattern to avoid the fragile transient-object issue.
     */
    public void recordEnrollment(Long courseId) {
        CourseAnalytics analytics = repository.findByCourseId(courseId).orElseGet(() -> {
            CourseAnalytics a = new CourseAnalytics();
            a.setCourseId(courseId);
            a.setTotalEnrollments(0);
            a.setCompletedEnrollments(0);
            a.setAverageRating(0.0);
            a.setTotalReviews(0);
            return a;
        });
        analytics.setTotalEnrollments(analytics.getTotalEnrollments() + 1);
        repository.save(analytics);
    }

    public void recordCompletion(Long courseId) {
        CourseAnalytics analytics = repository.findByCourseId(courseId).orElseGet(() -> {
            CourseAnalytics a = new CourseAnalytics();
            a.setCourseId(courseId);
            return a;
        });
        analytics.setCompletedEnrollments(analytics.getCompletedEnrollments() + 1);
        repository.save(analytics);
    }
}
