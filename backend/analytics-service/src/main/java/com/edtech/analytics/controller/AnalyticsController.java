package com.edtech.analytics.controller;

import com.edtech.analytics.entity.CourseAnalytics;
import com.edtech.analytics.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService service;

    @PostMapping("/course/{courseId}/enroll")
    public void recordEnrollmentDirect(@PathVariable Long courseId) {
        service.recordEnrollment(courseId);
    }

    @GetMapping("/course/{courseId}")
    public CourseAnalytics getCourseAnalytics(
            @PathVariable Long courseId,
            @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {
        
        if (!"INSTRUCTOR".equalsIgnoreCase(userRole) && !"ADMIN".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only instructors and admins can view course analytics");
        }
        
        return service.getAnalyticsForCourse(courseId);
    }

    @GetMapping("/admin/summary")
    public CourseAnalytics getAdminSummary(@RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {
        if (!"ADMIN".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can view global analytics");
        }
        return service.getAdminSummary();
    }

    @GetMapping("/instructor")
    public CourseAnalytics getInstructorSummary(
            @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole,
            @RequestHeader("loggedInUser") String loggedInUser) {
        if (!"INSTRUCTOR".equalsIgnoreCase(userRole) && !"ADMIN".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not authorized");
        }
        return service.getInstructorSummary(loggedInUser);
    }
}
