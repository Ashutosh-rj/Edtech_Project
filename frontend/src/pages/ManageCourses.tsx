import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { Link, useNavigate } from 'react-router-dom';
import { Edit, Trash2, PlusCircle, BookOpen, BarChart2, X, Users, CheckCircle, Star, MessageSquare } from 'lucide-react';
import { getCourseCoverImage } from '../api/youtubeUtils';

interface Course {
  id: number;
  title: string;
  category: string;
  price: number;
  status: string;
  thumbnailUrl: string;
}

interface CourseAnalytics {
  id: number;
  courseId: number;
  totalEnrollments: number;
  completedEnrollments: number;
  averageRating: number;
  totalReviews: number;
  lastUpdated: string;
}

export const ManageCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Analytics state
  const [analyticsCourseId, setAnalyticsCourseId] = useState<number | null>(null);
  const [analyticsData, setAnalyticsData] = useState<CourseAnalytics | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  const fetchCourses = async () => {
    try {
      const response = await apiClient.get('/courses/instructor');
      const data = response.data;
      const courseList = Array.isArray(data) ? data : (data.content ?? []);
      setCourses(courseList);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await apiClient.delete(`/courses/${id}`);
        setCourses(courses.filter(course => course.id !== id));
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  const handleViewAnalytics = async (courseId: number) => {
    setAnalyticsCourseId(courseId);
    setAnalyticsLoading(true);
    setAnalyticsData(null);
    try {
      const response = await apiClient.get(`/analytics/course/${courseId}`);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Fallback empty data if not found
      setAnalyticsData({
        id: 0,
        courseId,
        totalEnrollments: 0,
        completedEnrollments: 0,
        averageRating: 0,
        totalReviews: 0,
        lastUpdated: new Date().toISOString()
      });
    } finally {
      setAnalyticsLoading(false);
    }
  };

  if (loading) return (
    <div className="flex-col items-center justify-center py-12">
      <div className="grid-cards w-full">
        {[1, 2, 3].map(i => <div key={i} className="card skeleton" style={{ height: '320px' }}></div>)}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl mb-2">Manage Courses & Quizzes</h1>
          <p className="text-secondary text-lg">Create, update, and manage your courses and quizzes.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/manage-quizzes/new" className="btn btn-secondary flex items-center gap-2">
            <PlusCircle size={20} /> Create Quiz
          </Link>
          <Link to="/manage-courses/new" className="btn btn-primary flex items-center gap-2">
            <PlusCircle size={20} /> Create New Course
          </Link>
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="card flex-col items-center justify-center text-center" style={{ padding: 'var(--space-64)' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: 'var(--space-16)' }} />
          <h3 className="text-xl mb-2">No courses created yet</h3>
          <p className="text-secondary mb-6">You haven't created any courses. Start sharing your knowledge!</p>
          <Link to="/manage-courses/new" className="btn btn-primary">Create Your First Course</Link>
        </div>
      ) : (
        <div className="grid-cards">
          {courses.map(course => (
            <div key={course.id} className="card flex-col" style={{ padding: 0, overflow: 'hidden' }}>
              <img 
                src={getCourseCoverImage(course.thumbnailUrl, course.id)} 
                alt={course.title} 
                style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
              />
              <div className="flex-col h-full" style={{ padding: 'var(--space-20)' }}>
                <div className="flex justify-between items-start mb-2">
                   <span className="badge" style={{ background: course.status === 'PUBLISHED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: course.status === 'PUBLISHED' ? 'var(--success)' : 'var(--warning)' }}>
                    {course.status}
                  </span>
                  <span className="font-bold text-primary">${course.price.toFixed(2)}</span>
                </div>
                
                <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                <p className="text-secondary text-sm mb-4 flex-grow">{course.category}</p>
                
                <div className="flex gap-2 mb-2">
                  <button onClick={() => handleViewAnalytics(course.id)} className="btn btn-secondary w-full justify-center" style={{ background: 'var(--primary-light)', color: 'var(--primary)', borderColor: 'transparent' }}>
                    <BarChart2 size={16} /> Analytics
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button onClick={() => navigate(`/manage-courses/edit/${course.id}`)} className="btn btn-secondary flex-1 justify-center">
                    <Edit size={16} /> Edit
                  </button>
                  <button onClick={() => handleDelete(course.id)} className="btn btn-secondary flex-1 justify-center" style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Analytics Modal */}
      {analyticsCourseId && (
        <div style={{
          position: 'fixed', inset: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '90%', maxWidth: '640px', padding: 'var(--space-32)', position: 'relative', border: '1px solid var(--border)' }}>
            <button 
              onClick={() => setAnalyticsCourseId(null)}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              className="hover-bg p-2 rounded-full"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl mb-6 flex items-center gap-3">
              <BarChart2 color="var(--primary)" /> Course Analytics
            </h2>

            {analyticsLoading ? (
              <div className="text-center py-12 text-muted">Loading analytics data...</div>
            ) : analyticsData ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-20)' }}>
                <div className="card flex-col items-center justify-center text-center" style={{ padding: 'var(--space-24)', background: 'rgba(16, 185, 129, 0.05)', borderColor: 'transparent' }}>
                  <Users size={32} color="var(--success)" style={{ marginBottom: 'var(--space-12)' }} />
                  <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>{analyticsData.totalEnrollments}</div>
                  <div className="text-secondary font-medium">Total Enrollments</div>
                </div>
                
                <div className="card flex-col items-center justify-center text-center" style={{ padding: 'var(--space-24)', background: 'var(--primary-light)', borderColor: 'transparent' }}>
                  <CheckCircle size={32} color="var(--primary)" style={{ marginBottom: 'var(--space-12)' }} />
                  <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>{analyticsData.completedEnrollments}</div>
                  <div className="text-secondary font-medium">Completions</div>
                </div>

                <div className="card flex-col items-center justify-center text-center" style={{ padding: 'var(--space-24)', background: 'rgba(245, 158, 11, 0.05)', borderColor: 'transparent' }}>
                  <Star size={32} color="var(--warning)" style={{ marginBottom: 'var(--space-12)' }} />
                  <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>{analyticsData.averageRating.toFixed(1)}</div>
                  <div className="text-secondary font-medium">Avg Rating</div>
                </div>

                <div className="card flex-col items-center justify-center text-center" style={{ padding: 'var(--space-24)', background: 'rgba(139, 92, 246, 0.05)', borderColor: 'transparent' }}>
                  <MessageSquare size={32} color="#8b5cf6" style={{ marginBottom: 'var(--space-12)' }} />
                  <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--text-primary)' }}>{analyticsData.totalReviews}</div>
                  <div className="text-secondary font-medium">Total Reviews</div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
