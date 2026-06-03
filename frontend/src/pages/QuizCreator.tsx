import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { Plus, Trash2, ArrowLeft, Save, CheckCircle2, Circle } from 'lucide-react';

interface Course {
  id: number;
  title: string;
}

interface QuestionForm {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
}

export const QuizCreator = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  
  const [courseId, setCourseId] = useState<number | ''>('');
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState<QuestionForm[]>([
    { text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A' }
  ]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get('/courses/instructor');
        const data = response.data;
        const courseList = Array.isArray(data) ? data : (data.content ?? []);
        setCourses(courseList);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions, 
      { text: '', optionA: '', optionB: '', optionC: '', optionD: '', correctOption: 'A' }
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return;
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleQuestionChange = (index: number, field: keyof QuestionForm, value: string) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (courseId === '') return;
    
    setSubmitting(true);
    try {
      await apiClient.post('/quizzes', {
        courseId: Number(courseId),
        title,
        questions
      });
      alert('Quiz created successfully!');
      navigate('/manage-courses');
    } catch (error: any) {
      console.error('Error creating quiz:', error);
      alert(error.response?.data?.message || 'Failed to create quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '100px' }}>
      <form onSubmit={handleSubmit}>
        
        {/* Sticky Header */}
        <div 
          className="flex items-center justify-between py-4 mb-8 sticky top-0 z-10" 
          style={{ 
            background: 'var(--surface-1)', 
            borderBottom: '1px solid var(--border)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <div className="flex items-center gap-4">
            <button 
              type="button"
              className="btn btn-secondary flex items-center justify-center p-2 rounded-full hover-bg" 
              onClick={() => navigate('/manage-courses')}
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl m-0 font-bold">Create New Quiz</h1>
          </div>
          
          <div className="flex gap-4">
            <button type="button" className="btn btn-secondary flex items-center gap-2" onClick={handleAddQuestion}>
              <Plus size={16} /> Add Question
            </button>
            <button type="submit" className="btn btn-primary font-bold px-6 flex items-center gap-2" disabled={submitting}>
              <Save size={18} /> {submitting ? 'Saving...' : 'Save Quiz'}
            </button>
          </div>
        </div>

        <div className="flex-col gap-8">
          
          {/* General Info Card */}
          <div className="card p-8 shadow-sm">
            <h3 className="text-sm font-bold text-secondary uppercase tracking-wider mb-6 pb-2" style={{ borderBottom: '1px solid var(--border)' }}>
              Quiz Details
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-24)' }}>
              <div className="form-group mb-0">
                <label className="form-label text-sm font-bold">Course</label>
                <select 
                  className="form-input py-3 font-medium" 
                  value={courseId} 
                  onChange={e => setCourseId(e.target.value === '' ? '' : Number(e.target.value))}
                  required
                >
                  <option value="">-- Select a Course --</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group mb-0">
                <label className="form-label text-sm font-bold">Quiz Title</label>
                <input 
                  type="text" 
                  className="form-input py-3 font-medium" 
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Final Exam: Advanced React"
                  required
                />
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="flex-col gap-6">
            <h3 className="text-sm font-bold text-secondary uppercase tracking-wider pl-2">
              Questions ({questions.length})
            </h3>
            
            {questions.map((q, index) => (
              <div key={index} className="card p-0 overflow-hidden shadow-md" style={{ border: '1px solid var(--border)', transition: 'all 0.2s' }}>
                
                {/* Question Header */}
                <div className="flex items-center justify-between p-4 bg-surface-2" style={{ borderBottom: '1px solid var(--border)' }}>
                  <span className="font-bold text-primary flex items-center gap-2">
                    <span className="bg-primary text-white w-6 h-6 flex items-center justify-center rounded-full text-xs">{index + 1}</span>
                    Question {index + 1}
                  </span>
                  {questions.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveQuestion(index)}
                      className="text-danger hover-bg p-2 rounded-md flex items-center gap-2 text-sm font-medium transition-colors"
                      title="Remove Question"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  )}
                </div>

                {/* Question Body */}
                <div className="p-6">
                  <div className="form-group">
                    <input 
                      type="text" 
                      className="form-input text-lg py-3" 
                      value={q.text}
                      onChange={e => handleQuestionChange(index, 'text', e.target.value)}
                      placeholder="What is the main topic of..."
                      required
                    />
                  </div>

                  {/* Options Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)' }}>
                    {(['A', 'B', 'C', 'D'] as const).map(optionLetter => {
                      const optionKey = `option${optionLetter}` as keyof QuestionForm;
                      const isCorrect = q.correctOption === optionLetter;
                      
                      return (
                        <div 
                          key={optionLetter}
                          className={`flex items-center rounded-lg border-2 p-1 pr-4 transition-all ${isCorrect ? 'border-success bg-success-light' : 'border-border bg-surface-1'}`}
                        >
                          <div className="flex-grow">
                            <input 
                              type="text" 
                              className="w-full bg-transparent border-none outline-none p-3 font-medium text-sm" 
                              value={q[optionKey]} 
                              onChange={e => handleQuestionChange(index, optionKey, e.target.value)} 
                              placeholder={`Option ${optionLetter}`}
                              required 
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleQuestionChange(index, 'correctOption', optionLetter)}
                            className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full transition-colors ${isCorrect ? 'text-success' : 'text-secondary hover:bg-surface-3'}`}
                            title={`Mark Option ${optionLetter} as correct`}
                          >
                            {isCorrect ? <CheckCircle2 size={24} /> : <Circle size={20} />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center mt-4">
             <button type="button" className="btn btn-secondary flex items-center gap-2 py-3 px-8 border-dashed border-2" onClick={handleAddQuestion}>
                <Plus size={18} /> Add Another Question
             </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default QuizCreator;
