package com.edtech.review.controller;

import com.edtech.review.entity.Review;
import com.edtech.review.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {

    @Autowired
    private ReviewService service;

    @PostMapping
    public Review addReview(
            @RequestBody Review review, 
            @RequestHeader("loggedInUser") String loggedInUser,
            @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {
        
        if (!"STUDENT".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only students can leave reviews");
        }
        
        review.setStudentId(loggedInUser);
        return service.addReview(review);
    }

    @GetMapping("/course/{courseId}")
    public List<Review> getReviewsByCourse(@PathVariable Long courseId) {
        return service.getReviewsByCourse(courseId);
    }
}
