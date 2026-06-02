import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import { PlayCircle, Clock, Award, Shield, CheckCircle2 } from 'lucide-react';
import { getCourseCoverImage } from '../api/youtubeUtils';
import { CourseReviews } from '../components/CourseReviews';

interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: string;
  price: number;
  thumbnailUrl: string;
  category: string;
}

interface Lecture {
  id: number;
  title: string;
  videoId: string;
  durationSeconds: number;
}

export const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, loggedInUser } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const [courseRes, lecturesRes] = await Promise.all([
          apiClient.get(`/courses/${id}`),
          apiClient.get(`/lectures/course/${id}`)
        ]);
        setCourse(courseRes.data);
        setLectures(lecturesRes.data);
      } catch (error) {
        console.error('Error fetching course details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourseDetails();
  }, [id]);

  const handleEnroll = async () => {
    if (!loggedInUser) {
      navigate('/login');
      return;
    }
    
    setEnrolling(true);
    try {
      await apiClient.post(`/enrollments/${id}`);
      navigate('/');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error enrolling in course');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return (
    <div className="flex-col items-center justify-center py-12">
      <div className="card skeleton" style={{ width: '100%', height: '400px', marginBottom: 'var(--space-32)' }}></div>
      <div className="card skeleton" style={{ width: '100%', height: '200px' }}></div>
    </div>
  );
  if (!course) return <div className="card py-12 text-center mt-12"><h2 className="text-2xl text-muted">Course not found</h2></div>;

  const totalDurationMins = Math.floor(lectures.reduce((acc, curr) => acc + curr.durationSeconds, 0) / 60);

  // Instructors and Admins should not see the "Enroll" button
  const canEnroll = role !== 'INSTRUCTOR' && role !== 'ADMIN';

  return (
    <div>
      <div className="card" style={{ marginBottom: 'var(--space-32)', padding: 0, overflow: 'hidden', border: '1px solid var(--border)' }}>
        {/* Hero thumbnail from YouTube or Fallback */}
        <div style={{ position: 'relative', width: '100%', height: '380px', overflow: 'hidden', backgroundColor: 'var(--surface-3)' }}>
          <img
            src={getCourseCoverImage(course.thumbnailUrl, course.id, 'maxresdefault')}
            alt={course.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => { (e.currentTarget as HTMLImageElement).src = getCourseCoverImage(course.thumbnailUrl, course.id, 'hqdefault'); }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, var(--background) 0%, rgba(15,23,42,0.4) 60%, transparent 100%)' }} />
        </div>
        
        <div style={{ padding: 'var(--space-32)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-32)', flexWrap: 'wrap', position: 'relative', zIndex: 1, marginTop: '-120px' }}>
          <div style={{ maxWidth: '640px' }}>
            <div className="badge badge-primary mb-4" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
              {course.category || 'Tech Education'}
            </div>
            <h1 style={{ fontSize: '36px', fontWeight: 800, marginBottom: 'var(--space-16)', lineHeight: 1.2, color: 'var(--text-primary)' }}>{course.title}</h1>
            <p className="text-secondary text-lg" style={{ marginBottom: 'var(--space-24)', lineHeight: 1.6 }}>
              {course.description}
            </p>
            
            <div className="flex gap-6 text-secondary font-medium mb-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Clock size={20} color="var(--primary)" />
                <span>{totalDurationMins} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={20} color="var(--warning)" />
                <span>Certificate of Completion</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={20} color="var(--success)" />
                <span>Lifetime Access</span>
              </div>
            </div>
          </div>

          <div className="card" style={{ width: '320px', background: 'var(--surface-2)', flexShrink: 0, padding: 'var(--space-24)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ fontSize: '32px', fontWeight: '800', marginBottom: 'var(--space-24)', color: 'var(--text-primary)' }}>
              {course.price === 0 ? 'Free' : `$${course.price.toFixed(2)}`}
            </div>
            
            <div className="flex-col gap-3 mb-6 text-sm text-secondary">
              <div className="flex items-center gap-2"><CheckCircle2 size={16} color="var(--success)" /> Full lifetime access</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} color="var(--success)" /> Access on mobile and TV</div>
              <div className="flex items-center gap-2"><CheckCircle2 size={16} color="var(--success)" /> Certificate of completion</div>
            </div>

            {canEnroll ? (
              <button
                className="btn btn-primary w-full text-base py-3"
                onClick={handleEnroll}
                disabled={enrolling}
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            ) : (
              <div className="text-center p-3 bg-surface-3 rounded-md text-sm font-medium text-secondary border border-border">
                {role === 'INSTRUCTOR' ? 'Instructors cannot enroll' : 'Admins cannot enroll'}
              </div>
            )}
            
            <p className="text-xs text-muted text-center mt-4">
              30-Day Money-Back Guarantee
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 'var(--space-32)' }}>
        <div style={{ gridColumn: '1 / -1' }} className="lg-grid-col-1">
          <h2 className="text-2xl mb-6">Course Curriculum</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: 'var(--space-48)' }}>
            {lectures.length === 0 ? (
              <div style={{ padding: 'var(--space-32)', textAlign: 'center', color: 'var(--text-muted)' }}>No lectures available yet.</div>
            ) : (
              lectures.map((lecture, index) => (
                <div key={lecture.id} className="flex items-center p-4 hover-bg" style={{ borderBottom: index < lectures.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.2s' }}>
                  <PlayCircle size={20} color="var(--primary)" style={{ marginRight: 'var(--space-16)', flexShrink: 0 }} />
                  <div style={{ flexGrow: 1 }}>
                    <h4 className="text-base font-medium m-0">{lecture.title}</h4>
                  </div>
                  <div className="text-sm text-secondary font-medium whitespace-nowrap">
                    {Math.floor(lecture.durationSeconds / 60)} min
                  </div>
                </div>
              ))
            )}
          </div>

          <CourseReviews courseId={course.id} />
        </div>
      </div>
    </div>
  );
};
