package com.edtech.notification.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    @Autowired
    private NotificationService notificationService;

    @KafkaListener(topics = "user-registration", groupId = "notification-group")
    public void consumeUserRegistration(String email) {
        String subject = "Welcome to EdTech Platform!";
        String message = "Hello, your registration was successful. Welcome to our learning platform!";
        notificationService.processNotification(email, subject, message);
    }

    @KafkaListener(topics = "course-enrollment", groupId = "notification-group")
    public void consumeCourseEnrollment(String messagePayload) {
        // Assume payload is "email|courseName"
        String[] parts = messagePayload.split("\\|");
        if (parts.length == 2) {
            String email = parts[0];
            String courseName = parts[1];
            String subject = "Enrollment Successful: " + courseName;
            String message = "You have successfully enrolled in " + courseName + ". Happy learning!";
            notificationService.processNotification(email, subject, message);
        }
    }
}
