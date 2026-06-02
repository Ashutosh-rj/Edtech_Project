package com.edtech.review.service;

import com.edtech.review.entity.Review;
import com.edtech.review.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository repository;

    public Review addReview(Review review) {
        Optional<Review> existing = repository.findByCourseIdAndStudentId(review.getCourseId(), review.getStudentId());
        if (existing.isPresent()) {
            throw new RuntimeException("You have already reviewed this course");
        }
        if (review.getRating() < 1 || review.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        return repository.save(review);
    }

    public List<Review> getReviewsByCourse(Long courseId) {
        return repository.findByCourseId(courseId);
    }
}
