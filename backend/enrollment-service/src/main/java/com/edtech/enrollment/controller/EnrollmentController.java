package com.edtech.enrollment.controller;

import com.edtech.enrollment.entity.Enrollment;
import com.edtech.enrollment.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService service;

    /** MED-02: courseId is a path variable (matching what backend actually exposes) */
    @PostMapping("/{courseId}")
    public Enrollment enrollStudent(@PathVariable Long courseId,
                                    @RequestHeader("loggedInUser") String loggedInUser,
                                    @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {
        
        if ("ADMIN".equalsIgnoreCase(userRole) || "INSTRUCTOR".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admins and Instructors cannot enroll in courses.");
        }
        
        return service.enrollStudent(loggedInUser, courseId);
    }

    @GetMapping
    public List<Enrollment> getMyEnrollments(@RequestHeader("loggedInUser") String loggedInUser) {
        return service.getStudentEnrollments(loggedInUser);
    }

    /**
     * HIGH-09: New endpoint — the frontend's LecturePlayer fetches
     * enrollment data by courseId to get progress/completion status.
     */
    @GetMapping("/course/{courseId}")
    public Enrollment getEnrollmentByCourse(@PathVariable Long courseId,
                                            @RequestHeader("loggedInUser") String loggedInUser) {
        return service.getEnrollmentByCourse(loggedInUser, courseId);
    }

    /**
     * HIGH-08: Progress param is named `progress` (not `percentage`).
     * Path variable is courseId (not enrollment record id).
     */
    @PutMapping("/{courseId}/progress")
    public Enrollment updateProgress(
            @PathVariable Long courseId,
            @RequestParam double progress,
            @RequestHeader("loggedInUser") String loggedInUser) {
        return service.updateProgress(loggedInUser, courseId, progress);
    }
}
