package com.edtech.quiz.controller;

import com.edtech.quiz.entity.Quiz;
import com.edtech.quiz.entity.QuizSubmission;
import com.edtech.quiz.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/quizzes")
public class QuizController {

    @Autowired
    private QuizService service;

    /**
     * HIGH-02: Instructor-only — role forwarded as X-User-Role by the api-gateway.
     */
    @PostMapping
    public Quiz createQuiz(@RequestBody Quiz quiz,
                           @RequestHeader("loggedInUser") String loggedInUser,
                           @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {
        if (!"INSTRUCTOR".equalsIgnoreCase(userRole) && !"ADMIN".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only instructors can create quizzes");
        }
        return service.createQuiz(quiz);
    }

    @GetMapping("/course/{courseId}")
    public List<Quiz> getQuizzesByCourse(@PathVariable Long courseId) {
        return service.getQuizzesByCourse(courseId);
    }

    @GetMapping("/{id}")
    public Quiz getQuizById(@PathVariable Long id) {
        return service.getQuizById(id);
    }

    @PostMapping("/{quizId}/submit")
    public QuizSubmission submitQuiz(
            @PathVariable Long quizId,
            @RequestBody Map<Integer, String> answers,
            @RequestHeader("loggedInUser") String loggedInUser,
            @RequestHeader(value = "X-User-Role", defaultValue = "STUDENT") String userRole) {
        
        if (!"STUDENT".equalsIgnoreCase(userRole)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only students can submit quizzes");
        }
            
        return service.submitQuiz(quizId, loggedInUser, answers);
    }
}
