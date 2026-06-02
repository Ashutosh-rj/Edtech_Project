import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { ArrowLeft, CheckCircle, Circle, Trophy } from 'lucide-react';

interface Question {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
}

interface Quiz {
  id: number;
  courseId: number;
  title: string;
  questions: Question[];
}

interface QuizSubmission {
  id: number;
  score: number;
  totalQuestions: number;
  submittedAt: string;
}

export const QuizPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Mapping of question index to selected option ("A", "B", "C", "D")
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submission, setSubmission] = useState<QuizSubmission | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await apiClient.get(`/quizzes/${id}`);
        setQuiz(response.data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuiz();
  }, [id]);

  const handleOptionSelect = (questionIndex: number, option: string) => {
    if (submission) return; // Cannot change answers after submission
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    
    // Check if all questions are answered
    if (Object.keys(answers).length < quiz.questions.length) {
      if (!window.confirm("You haven't answered all questions. Submit anyway?")) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const response = await apiClient.post(`/quizzes/${quiz.id}/submit`, answers);
      setSubmission(response.data);
      
      // Auto-scroll to top to show results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      alert(error.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex-col items-center justify-center py-12" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card skeleton w-full" style={{ height: '600px' }}></div>
    </div>
  );
  if (!quiz) return <div className="text-center py-12 text-secondary">Quiz not found</div>;

  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / quiz.questions.length) * 100;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '100px' }}>
      
      {/* Immersive Header */}
      <div 
        className="flex-col gap-4 py-4 mb-8 sticky top-0 z-10" 
        style={{ 
          background: 'var(--surface-1)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              className="btn btn-secondary flex items-center justify-center p-2 rounded-full hover-bg" 
              onClick={() => navigate(`/courses/${quiz.courseId}`)}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl m-0 font-bold truncate max-w-[400px]">{quiz.title}</h1>
          </div>
          
          {!submission && (
            <div className="text-sm font-bold text-secondary">
              <span className="text-primary">{answeredCount}</span> / {quiz.questions.length} Answered
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {!submission && (
          <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        )}
      </div>

      <div className="flex-col">
        {submission ? (
          <div className="flex-col items-center text-center p-12 mb-8 shadow-md" style={{ backgroundColor: 'var(--surface-1)', borderRadius: 'var(--radius-lg)', border: '2px solid var(--success)' }}>
            <Trophy size={64} className="text-success mb-6" />
            <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
            <div style={{ fontSize: '4rem', fontWeight: 900, color: 'var(--success)', lineHeight: 1, margin: 'var(--space-12) 0' }}>
              {submission.score} <span className="text-2xl text-secondary">/ {submission.totalQuestions}</span>
            </div>
            <p className="text-secondary font-medium text-lg">
              Submitted on {new Date(submission.submittedAt).toLocaleString()}
            </p>
            <button 
              className="btn btn-primary mt-8 px-8 py-3 text-lg font-bold" 
              onClick={() => navigate(`/courses/${quiz.courseId}`)}
            >
              Return to Course
            </button>
          </div>
        ) : null}

        <div className="flex-col gap-12">
          {quiz.questions.map((question, index) => {
            const isAnswered = answers[index] !== undefined;
            return (
              <div 
                key={index} 
                className="flex-col p-8 rounded-xl shadow-sm transition-opacity duration-300"
                style={{ 
                  backgroundColor: 'var(--surface-1)',
                  border: '1px solid var(--border)',
                  opacity: (submission || isAnswered || Object.keys(answers).length === index) ? 1 : 0.6
                }}
              >
                <div className="flex gap-4 items-start mb-8">
                  <span className="flex-shrink-0 text-white font-bold bg-primary w-8 h-8 flex items-center justify-center rounded-full">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold pt-1 leading-snug">{question.text}</h3>
                </div>
                
                <div className="flex-col gap-4">
                  {(['A', 'B', 'C', 'D'] as const).map(optionLetter => {
                    const optionKey = `option${optionLetter}` as keyof Question;
                    const optionText = question[optionKey];
                    if (!optionText) return null;
                    
                    const isSelected = answers[index] === optionLetter;
                    
                    return (
                      <div 
                        key={optionLetter}
                        onClick={() => handleOptionSelect(index, optionLetter)}
                        className={`flex items-center p-5 rounded-xl border-2 transition-all duration-200 ${isSelected ? 'bg-primary-light border-primary shadow-sm' : 'bg-surface-2 border-transparent hover:border-border hover:bg-surface-3'}`}
                        style={{ 
                          cursor: submission ? 'default' : 'pointer',
                          transform: (!submission && isSelected) ? 'translateY(-2px)' : 'none'
                        }}
                      >
                        <div className={`mr-4 w-6 h-6 flex-shrink-0 flex items-center justify-center rounded-full transition-colors ${isSelected ? 'text-primary' : 'text-secondary'}`}>
                           {isSelected ? <CheckCircle size={24} /> : <Circle size={24} />}
                        </div>
                        <span className={`text-lg font-medium ${isSelected ? 'text-primary' : 'text-primary'}`}>
                          {optionText}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {!submission && (
          <div className="flex justify-end mt-12 pt-8" style={{ borderTop: '2px dashed var(--border)' }}>
            <button 
              className="btn btn-primary shadow-md flex items-center gap-2 transition-transform hover:-translate-y-1" 
              style={{ padding: '16px 48px', fontSize: '1.2rem', fontWeight: 800, borderRadius: 'var(--radius-full)' }}
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
              {!submitting && <CheckCircle size={20} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
