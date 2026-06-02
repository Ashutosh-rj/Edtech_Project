package com.edtech.notification.service;

import com.edtech.notification.entity.Notification;
import com.edtech.notification.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository repository;

    @Autowired
    private JavaMailSender mailSender;

    public void processNotification(String recipientId, String subject, String message) {
        // Save to DB
        Notification notification = new Notification();
        notification.setRecipientId(recipientId);
        notification.setSubject(subject);
        notification.setMessage(message);
        repository.save(notification);

        // Send Email
        sendEmail(recipientId, subject, message);
    }

    private void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@edtechplatform.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + to + ": " + e.getMessage());
        }
    }

    public List<Notification> getNotificationsForUser(String userId) {
        return repository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    /**
     * HIGH-01: Fetch a single notification — used by controller to verify ownership
     * before marking as read.
     */
    public Notification getNotificationById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + id));
    }

    public void markAsRead(Long notificationId) {
        Optional<Notification> notif = repository.findById(notificationId);
        if (notif.isPresent()) {
            Notification n = notif.get();
            n.setRead(true);
            repository.save(n);
        }
    }
}
