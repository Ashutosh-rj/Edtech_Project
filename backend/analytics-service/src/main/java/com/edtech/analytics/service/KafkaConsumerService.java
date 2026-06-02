package com.edtech.analytics.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

/**
 * HIGH-06: Connects analytics-service to Kafka event streams.
 *
 * Listens for events published by other services:
 *   - enrollment-service → "course-enrollment" topic (payload: "studentId:courseId")
 *
 * This ensures analytics data is actually updated in real-time, fixing the
 * issue where all analytics were always zero.
 */
@Service
public class KafkaConsumerService {

    @Autowired
    private AnalyticsService analyticsService;

    @KafkaListener(topics = "course-enrollment", groupId = "analytics-group")
    public void handleEnrollmentEvent(String payload) {
        try {
            // Payload format: "studentEmail:courseId"
            String[] parts = payload.split(":");
            if (parts.length >= 2) {
                Long courseId = Long.parseLong(parts[1]);
                analyticsService.recordEnrollment(courseId);
            }
        } catch (Exception e) {
            System.err.println("Analytics: failed to process enrollment event: " + e.getMessage());
        }
    }
}
