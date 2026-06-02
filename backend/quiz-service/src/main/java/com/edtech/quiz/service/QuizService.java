package com.edtech.quiz.service;

import com.edtech.quiz.entity.Question;
import com.edtech.quiz.entity.Quiz;
import com.edtech.quiz.entity.QuizSubmission;
import com.edtech.quiz.repository.QuizRepository;
import com.edtech.quiz.repository.QuizSubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizSubmissionRepository submissionRepository;

    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public List<Quiz> getQuizzesByCourse(Long courseId) {
        return quizRepository.findByCourseId(courseId);
    }

    public Quiz getQuizById(Long id) {
        return quizRepository.findById(id).orElseThrow(() -> new RuntimeException("Quiz not found"));
    }

    public QuizSubmission submitQuiz(Long quizId, String studentId, Map<Integer, String> answers) {
        Quiz quiz = getQuizById(quizId);
        
        Optional<QuizSubmission> existing = submissionRepository.findByQuizIdAndStudentId(quizId, studentId);
        if (existing.isPresent()) {
            throw new RuntimeException("You have already submitted this quiz");
        }

        int score = 0;
        List<Question> questions = quiz.getQuestions();
        
        for (Map.Entry<Integer, String> entry : answers.entrySet()) {
            int qIndex = entry.getKey();
            String studentAnswer = entry.getValue();
            
            if (qIndex >= 0 && qIndex < questions.size()) {
                Question question = questions.get(qIndex);
                if (question.getCorrectOption() != null && question.getCorrectOption().equalsIgnoreCase(studentAnswer)) {
                    score++;
                }
            }
        }

        QuizSubmission submission = new QuizSubmission();
        submission.setQuizId(quizId);
        submission.setStudentId(studentId);
        submission.setAnswers(answers);
        submission.setScore(score);
        submission.setTotalQuestions(questions.size());

        return submissionRepository.save(submission);
    }
}
