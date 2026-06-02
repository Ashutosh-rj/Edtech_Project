package com.edtech.notification.controller;

import com.edtech.notification.entity.Notification;
import com.edtech.notification.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationService service;

    @GetMapping
    public List<Notification> getMyNotifications(@RequestHeader("loggedInUser") String loggedInUser) {
        return service.getNotificationsForUser(loggedInUser);
    }

    /**
     * HIGH-01: Added ownership verification — a user can only mark their OWN
     * notifications as read. Previously any authenticated user could mark
     * any notification as read by ID.
     */
    @PutMapping("/{id}/read")
    public void markAsRead(@PathVariable Long id,
                           @RequestHeader("loggedInUser") String loggedInUser) {
        Notification notification = service.getNotificationById(id);
        if (!notification.getRecipientId().equals(loggedInUser)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                    "You do not have permission to mark this notification as read");
        }
        service.markAsRead(id);
    }
}
