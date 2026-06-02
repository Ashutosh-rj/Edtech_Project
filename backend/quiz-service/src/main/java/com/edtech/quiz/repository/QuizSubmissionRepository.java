package com.edtech.quiz.repository;

import com.edtech.quiz.entity.QuizSubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuizSubmissionRepository extends JpaRepository<QuizSubmission, Long> {
    List<QuizSubmission> findByStudentId(String studentId);
    Optional<QuizSubmission> findByQuizIdAndStudentId(Long quizId, String studentId);
}
