package com.edtech.enrollment.service;

import com.edtech.enrollment.entity.Enrollment;
import com.edtech.enrollment.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {

    @Autowired
    private EnrollmentRepository repository;

    @Autowired(required = false) // optional so service starts without Kafka broker
    private KafkaTemplate<String, String> kafkaTemplate;

    @Autowired
    private RestTemplate restTemplate;

    public Enrollment enrollStudent(String studentId, Long courseId) {
        Optional<Enrollment> existing = repository.findByStudentIdAndCourseId(studentId, courseId);
        if (existing.isPresent()) {
            throw new RuntimeException("Student is already enrolled in this course");
        }

        Enrollment enrollment = new Enrollment();
        enrollment.setStudentId(studentId);
        enrollment.setCourseId(courseId);
        Enrollment saved = repository.save(enrollment);

        // HIGH-07: Publish enrollment event so notification-service can send confirmation email
        try {
            if (kafkaTemplate != null) {
                kafkaTemplate.send("course-enrollment", studentId + ":" + courseId);
            }
        } catch (Exception e) {
            System.err.println("Kafka send failed: " + e.getMessage());
        }

        // Direct REST call to analytics-service to bypass Kafka (for local dev)
        try {
            restTemplate.postForObject("http://localhost:8089/analytics/course/" + courseId + "/enroll", null, Void.class);
        } catch (Exception e) {
            System.err.println("Failed to notify analytics-service via REST: " + e.getMessage());
        }

        return saved;
    }

    public List<Enrollment> getStudentEnrollments(String studentId) {
        return repository.findByStudentId(studentId);
    }

    /**
     * HIGH-09: New method to find a single enrollment for a student + course.
     * Used by the LecturePlayer page.
     */
    public Enrollment getEnrollmentByCourse(String studentId, Long courseId) {
        return repository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Enrollment not found for course " + courseId));
    }

    public Enrollment updateProgress(String studentId, Long courseId, double progress) {
        Enrollment enrollment = repository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new org.springframework.web.server.ResponseStatusException(
                        org.springframework.http.HttpStatus.NOT_FOUND, "Enrollment not found"));

        enrollment.setProgressPercentage(progress);
        enrollment.setLastAccessedAt(LocalDateTime.now());

        // MED-07: uses setCompleted() (renamed from isCompleted) 
        if (progress >= 100.0) {
            enrollment.setCompleted(true);
        }

        return repository.save(enrollment);
    }
}
