import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { Link } from 'react-router-dom';
import { PlayCircle, Award, Clock, BookOpen, ShieldCheck, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getCourseCoverImage } from '../api/youtubeUtils';

interface Enrollment {
  id: number;
  courseId: number;
  studentId: string;
  enrollmentDate: string;
  progressPercentage: number;
  completed: boolean;
}

interface Course {
  id: number;
  title: string;
  thumbnailUrl: string;
}

export const Dashboard = () => {
  const { role } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Record<number, Course>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [enrollmentsRes, coursesRes] = await Promise.all([
          apiClient.get('/enrollments'),
          apiClient.get('/courses')
        ]);
        setEnrollments(enrollmentsRes.data);
        
        const courseMap: Record<number, Course> = {};
        const data = coursesRes.data;
        const courseList = Array.isArray(data) ? data : (data.content ?? []);
        courseList.forEach((course: Course) => {
          courseMap[course.id] = course;
        });
        setCourses(courseMap);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return (
    <div className="flex-col items-center justify-center py-12">
      <div className="card skeleton" style={{ width: '100%', height: '160px', marginBottom: 'var(--space-32)' }}></div>
      <div className="grid-cards" style={{ width: '100%' }}>
        {[1, 2, 3].map(i => <div key={i} className="card skeleton" style={{ height: '240px' }}></div>)}
      </div>
    </div>
  );

  // ── ADMIN view ──────────────────────────────────────────────────────────────
  if ((role ?? '').toUpperCase() === 'ADMIN') {
    return (
      <div>
        <div style={{ marginBottom: 'var(--space-32)' }}>
          <h1 className="text-3xl mb-2">Admin Dashboard</h1>
          <p className="text-secondary text-lg">Manage the entire platform from one place.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 'var(--space-24)', marginBottom: 'var(--space-48)' }}>
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <div className="card flex items-center gap-4" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; }}>
              <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: 'var(--space-16)', borderRadius: 'var(--radius-md)', color: 'var(--danger)' }}>
                <ShieldCheck size={32} />
              </div>
              <div>
                <h3 className="text-lg m-0 text-primary">Admin Panel</h3>
                <p className="text-secondary text-sm m-0 mt-1">Manage all courses &amp; users</p>
              </div>
            </div>
          </Link>
          <Link to="/manage-courses" style={{ textDecoration: 'none' }}>
            <div className="card flex items-center gap-4" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; }}>
              <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: 'var(--space-16)', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}>
                <GraduationCap size={32} />
              </div>
              <div>
                <h3 className="text-lg m-0 text-primary">Manage Courses</h3>
                <p className="text-secondary text-sm m-0 mt-1">Create and edit courses</p>
              </div>
            </div>
          </Link>
          <Link to="/courses" style={{ textDecoration: 'none' }}>
            <div className="card flex items-center gap-4" style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-md)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-sm)'; }}>
              <div style={{ background: 'var(--primary-light)', padding: 'var(--space-16)', borderRadius: 'var(--radius-md)', color: 'var(--primary)' }}>
                <BookOpen size={32} />
              </div>
              <div>
                <h3 className="text-lg m-0 text-primary">Course Catalog</h3>
                <p className="text-secondary text-sm m-0 mt-1">Browse published courses</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{
        marginBottom: 'var(--space-32)',
        padding: 'var(--space-48) var(--space-32)',
        borderRadius: 'var(--radius-xl)',
        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.95) 40%, rgba(15, 23, 42, 0.4)), url('/images/purple-lake.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 'var(--space-20)',
        color: '#f8fafc'
      }}>
        <div>
          <h1 style={{ fontSize: '36px', marginBottom: 'var(--space-8)', color: '#f8fafc' }}>My Dashboard</h1>
          <p style={{ color: '#cbd5e1', fontSize: '18px' }}>Welcome back! Continue your learning journey.</p>
        </div>
        <div className="flex gap-4">
          <Link to="/manage-courses" className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.1)', color: '#f8fafc', borderColor: 'rgba(255,255,255,0.2)' }}>
            Manage Courses
          </Link>
          <Link to="/courses" className="btn btn-primary">
            Explore New Courses
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-24)', marginBottom: 'var(--space-48)' }}>
        <div className="card flex items-center gap-4">
          <div style={{ background: 'var(--primary-light)', padding: 'var(--space-16)', borderRadius: 'var(--radius-lg)', color: 'var(--primary)' }}>
            <PlayCircle size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{enrollments.filter(e => !e.completed).length}</h3>
            <p className="text-secondary text-sm m-0 font-medium mt-1">Active Courses</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: 'var(--space-16)', borderRadius: 'var(--radius-lg)', color: 'var(--success)' }}>
            <Award size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{enrollments.filter(e => e.completed).length}</h3>
            <p className="text-secondary text-sm m-0 font-medium mt-1">Completed</p>
          </div>
        </div>
        <div className="card flex items-center gap-4">
          <div style={{ background: 'rgba(245, 158, 11, 0.1)', padding: 'var(--space-16)', borderRadius: 'var(--radius-lg)', color: 'var(--warning)' }}>
            <Clock size={32} />
          </div>
          <div>
            <h3 style={{ fontSize: '28px', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>{enrollments.length}</h3>
            <p className="text-secondary text-sm m-0 font-medium mt-1">Total Enrollments</p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl mb-6">Continue Learning</h2>
      {enrollments.length === 0 ? (
        <div className="card flex-col items-center justify-center text-center" style={{ padding: 'var(--space-64)' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: 'var(--space-16)' }} />
          <h3 className="text-xl mb-2">No enrollments yet</h3>
          <p className="text-secondary mb-6">You haven't enrolled in any courses. Browse our catalog to get started!</p>
          <Link to="/courses" className="btn btn-primary">Browse Catalog</Link>
        </div>
      ) : (
        <div className="grid-cards">
          {enrollments.map(enrollment => {
            const course = courses[enrollment.courseId];
            return (
            <div key={enrollment.id} className="card flex-col" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <img 
                  src={getCourseCoverImage(course?.thumbnailUrl, enrollment.courseId)} 
                  alt={course?.title || 'Course'} 
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                />
              </div>
              <div className="flex-col h-full" style={{ padding: 'var(--space-20)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-xs" style={{ color: enrollment.completed ? 'var(--success)' : 'var(--warning)' }}>
                    {enrollment.completed ? 'Completed' : 'In Progress'}
                  </span>
                  <span className="text-secondary text-xs font-medium">{enrollment.progressPercentage}%</span>
                </div>
                
                <div style={{ width: '100%', height: '6px', background: 'var(--surface-3)', borderRadius: 'var(--radius-full)', marginBottom: 'var(--space-16)', overflow: 'hidden' }}>
                  <div style={{ width: `${enrollment.progressPercentage}%`, height: '100%', background: enrollment.completed ? 'var(--success)' : 'var(--primary)', borderRadius: 'var(--radius-full)' }}></div>
                </div>

                <h3 className="text-lg font-bold mb-4" style={{ lineHeight: 1.3 }}>{course ? course.title : `Course ID: ${enrollment.courseId}`}</h3>
                
                <div style={{ marginTop: 'auto' }}>
                  <Link to={`/lectures/${enrollment.courseId}`} className="btn btn-secondary w-full justify-center">
                    <PlayCircle size={18} /> {enrollment.completed ? 'Review Material' : 'Resume Course'}
                  </Link>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

