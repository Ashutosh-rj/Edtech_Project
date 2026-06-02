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

    @GetMapping("/course/{courseId}")
    public CourseAnalytics getCourseAnalytics(
            @PathVariable Long courseId,
            @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {
        
        if (!"INSTRUCTOR".equalsIgnoreCase(userRole) && !"ADMIN".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only instructors and admins can view course analytics");
        }
        
        return service.getAnalyticsForCourse(courseId);
    }
}
