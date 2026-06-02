import { Link, useNavigate } from 'react-router-dom';
import { PlayCircle, Star, Users, CheckCircle, Code, Database, Cpu, BrainCircuit, Cloud, ShieldCheck, Smartphone, Layout, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';
import { getCourseCoverImage } from '../api/youtubeUtils';

interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: string;
  price: number;
  thumbnailUrl: string;
  published: boolean;
}

const categories = [
  { name: 'Web Development', icon: Code, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { name: 'Data Science', icon: Database, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { name: 'Machine Learning', icon: BrainCircuit, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { name: 'Cloud Computing', icon: Cloud, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  { name: 'Cybersecurity', icon: ShieldCheck, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  { name: 'Mobile Dev', icon: Smartphone, color: '#ec4899', bg: 'rgba(236,72,153,0.1)' },
  { name: 'System Design', icon: Cpu, color: '#14b8a6', bg: 'rgba(20,184,166,0.1)' },
  { name: 'UI/UX Design', icon: Layout, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [dbCourses, setDbCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get('/courses');
        const data = response.data;
        const courseList = Array.isArray(data) ? data : (data.content ?? []);
        setDbCourses(courseList.slice(0, 4));
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: 'var(--space-64) var(--space-20)',
        textAlign: 'center',
        position: 'relative',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('/images/night-sky.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, marginBottom: 'var(--space-24)', letterSpacing: '-0.02em', color: '#ffffff' }}>
          Unlock Your Potential with World-Class Tech Education
        </h1>
        <p style={{ fontSize: '18px', color: '#cbd5e1', maxWidth: '700px', margin: '0 auto var(--space-40) auto', lineHeight: 1.8 }}>
          Join millions of learners from around the globe. Master modern tech skills, from Web Development and AI to Cloud Computing and System Design, taught by industry experts.
        </p>
        <div className="flex justify-center gap-4 mb-8" style={{ flexWrap: 'wrap' }}>
          <Link to="/courses" className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '16px' }}>
            Explore Courses
          </Link>
          <Link to="/register" className="btn btn-secondary" style={{ padding: '14px 28px', fontSize: '16px', background: 'rgba(255,255,255,0.1)', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}>
            Get Started for Free
          </Link>
        </div>
        
        {/* Search Bar in Hero */}
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', boxShadow: 'var(--shadow-md)' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="What do you want to learn today?" 
              style={{ flexGrow: 1, background: 'transparent', border: 'none', color: 'white', padding: '12px 16px', fontSize: '16px', outline: 'none' }}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </section>

      {/* Statistics */}
      <section style={{ padding: 'var(--space-64) 0 var(--space-32) 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-24)' }}>
          {[
            { label: 'Students Worldwide', count: '2M+' },
            { label: 'Premium Courses', count: '10k+' },
            { label: 'Expert Instructors', count: '1,500+' },
            { label: 'Placement Rate', count: '94%' },
          ].map((stat, i) => (
            <div key={i} className="card" style={{ padding: 'var(--space-32)', textAlign: 'center' }}>
              <div style={{ fontSize: '36px', fontWeight: 800, color: 'var(--primary)', marginBottom: 'var(--space-8)' }}>{stat.count}</div>
              <div className="text-secondary font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses */}
      <section style={{ padding: 'var(--space-48) 0' }}>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl mb-2">Featured Courses</h2>
            <p className="text-secondary text-lg">Top-rated courses chosen by our experts.</p>
          </div>
          <Link to="/courses" className="font-semibold" style={{ color: 'var(--primary)' }}>View All Courses &rarr;</Link>
        </div>

        {loading ? (
          <div className="grid-cards">
            {[1, 2, 3, 4].map(i => <div key={i} className="card skeleton" style={{ height: '360px', border: 'none' }}></div>)}
          </div>
        ) : dbCourses.length === 0 ? (
          <div className="card flex-col items-center justify-center py-12">
            <p className="text-muted">No published courses found. Log in as an instructor to add some!</p>
          </div>
        ) : (
          <div className="grid-cards">
            {dbCourses.map(course => (
              <div key={course.id} className="card flex-col" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src={getCourseCoverImage(course.thumbnailUrl, course.id)} 
                    alt={course.title} 
                    style={{ width: '100%', height: '180px', objectFit: 'cover' }} 
                  />
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="badge badge-primary" style={{ background: 'var(--surface-1)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-sm)' }}>
                      {course.price != null && course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
                    </span>
                  </div>
                </div>
                
                <div className="flex-col h-full" style={{ padding: 'var(--space-20)' }}>
                  <h3 className="text-lg font-bold" style={{ marginBottom: 'var(--space-8)', lineHeight: 1.3 }}>{course.title}</h3>
                  <p className="text-secondary text-sm mb-4">By Instructor {course.instructorId}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted mt-auto mb-4">
                    <div className="flex items-center gap-2">
                      <Star size={14} color="var(--warning)" fill="var(--warning)" />
                      <span className="font-medium text-primary">4.8</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} />
                      <span>1,200 students</span>
                    </div>
                  </div>

                  <Link to={`/courses/${course.id}`} className="btn btn-primary w-full mt-auto">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Top Categories */}
      <section style={{ padding: 'var(--space-48) 0' }}>
        <h2 className="text-3xl text-center mb-2">Top Categories</h2>
        <p className="text-secondary text-lg text-center mb-8">Discover courses in highly sought-after fields.</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 'var(--space-24)' }}>
          {categories.map(cat => (
            <Link to={`/courses?category=${encodeURIComponent(cat.name)}`} key={cat.name} className="card flex-col items-center justify-center p-8" style={{ transition: 'all 0.2s ease', textDecoration: 'none' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-lg)', background: cat.bg, color: cat.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-16)' }}>
                <cat.icon size={32} />
              </div>
              <h3 className="text-base m-0 text-primary">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section style={{ padding: 'var(--space-64) 0' }}>
        <div className="card" style={{ padding: 'var(--space-64)', background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-48)' }}>
            <h2 className="text-4xl mb-4">Why Choose EdTech Enterprise?</h2>
            <p className="text-secondary text-lg" style={{ maxWidth: '600px', margin: '0 auto' }}>
              We provide everything you need to take your career to the next level.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-32)' }}>
            <div className="flex gap-4 items-start">
              <div style={{ background: 'var(--primary-light)', padding: 'var(--space-12)', borderRadius: '50%', color: 'var(--primary)' }}>
                <CheckCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg mb-2">Expert Instructors</h3>
                <p className="text-secondary text-sm">Learn from industry leaders who have worked at top tech companies worldwide.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div style={{ background: 'rgba(16,185,129,0.1)', padding: 'var(--space-12)', borderRadius: '50%', color: 'var(--success)' }}>
                <PlayCircle size={24} />
              </div>
              <div>
                <h3 className="text-lg mb-2">Lifetime Access</h3>
                <p className="text-secondary text-sm">Learn on your schedule. Once you enroll, you have access to the materials forever.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div style={{ background: 'rgba(245,158,11,0.1)', padding: 'var(--space-12)', borderRadius: '50%', color: 'var(--warning)' }}>
                <Users size={24} />
              </div>
              <div>
                <h3 className="text-lg mb-2">Placement Assistance</h3>
                <p className="text-secondary text-sm">Get resume reviews, mock interviews, and referrals to our hiring partners.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
