package com.edtech.analytics.service;

import com.edtech.analytics.entity.CourseAnalytics;
import com.edtech.analytics.repository.CourseAnalyticsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    @Autowired
    private CourseAnalyticsRepository repository;

    @Autowired
    private RestTemplate restTemplate;

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
            empty.setTotalRevenue(0.0);
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
            a.setTotalRevenue(0.0);
            return a;
        });
        analytics.setTotalEnrollments(analytics.getTotalEnrollments() + 1);
        
        try {
            Map course = restTemplate.getForObject("http://localhost:8082/courses/" + courseId, Map.class);
            if (course != null && course.get("price") != null) {
                double price = Double.parseDouble(course.get("price").toString());
                analytics.setTotalRevenue(analytics.getTotalRevenue() + price);
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch course price for revenue tracking: " + e.getMessage());
        }

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

    public CourseAnalytics getAdminSummary() {
        List<CourseAnalytics> all = repository.findAll();
        return aggregate(all);
    }

    public CourseAnalytics getInstructorSummary(String loggedInUser) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("loggedInUser", loggedInUser);
            HttpEntity<String> entity = new HttpEntity<>("", headers);
            
            ResponseEntity<List> response = restTemplate.exchange(
                    "http://localhost:8082/courses/instructor",
                    HttpMethod.GET,
                    entity,
                    List.class
            );
            
            List courses = response.getBody();
            if (courses == null || courses.isEmpty()) {
                return new CourseAnalytics();
            }
            
            List<Long> courseIds = courses.stream()
                .map(c -> Long.parseLong(((Map) c).get("id").toString()))
                .toList();
                
            List<CourseAnalytics> instructorAnalytics = repository.findAllById(courseIds);
            return aggregate(instructorAnalytics);
        } catch (Exception e) {
            System.err.println("Failed to fetch instructor courses: " + e.getMessage());
            return new CourseAnalytics();
        }
    }

    private CourseAnalytics aggregate(List<CourseAnalytics> list) {
        CourseAnalytics summary = new CourseAnalytics();
        summary.setCourseId(0L);
        for (CourseAnalytics a : list) {
            summary.setTotalEnrollments(summary.getTotalEnrollments() + a.getTotalEnrollments());
            summary.setCompletedEnrollments(summary.getCompletedEnrollments() + a.getCompletedEnrollments());
            summary.setTotalRevenue(summary.getTotalRevenue() + a.getTotalRevenue());
            summary.setTotalReviews(summary.getTotalReviews() + a.getTotalReviews());
        }
        if (!list.isEmpty()) {
            summary.setAverageRating(list.stream().mapToDouble(CourseAnalytics::getAverageRating).average().orElse(0.0));
        }
        return summary;
    }
}
