import { useEffect, useState } from 'react';
import { apiClient } from '../api/apiClient';
import { Link, useSearchParams } from 'react-router-dom';
import { Star, Users, BookOpen } from 'lucide-react';
import { getCourseCoverImage } from '../api/youtubeUtils';

interface Course {
  id: number;
  title: string;
  description: string;
  instructorId: string;
  price: number;
  thumbnailUrl: string;
  published: boolean;
  category: string;
}

export const CourseCatalog = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryQuery = searchParams.get('category');
  const searchQuery = searchParams.get('q');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiClient.get('/courses');
        const data = response.data;
        const courseList = Array.isArray(data) ? data : (data.content ?? []);
        setCourses(courseList);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(c => {
    let match = true;
    if (categoryQuery && categoryQuery !== 'all') {
      match = match && c.category?.toLowerCase() === categoryQuery.toLowerCase();
    }
    if (searchQuery) {
      match = match && (
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return match;
  });

  const allCategories = Array.from(new Set(courses.map(c => c.category).filter(Boolean)));

  return (
    <div>
      <div style={{
        marginBottom: 'var(--space-32)',
        padding: 'var(--space-48) var(--space-32)',
        borderRadius: 'var(--radius-xl)',
        backgroundImage: `linear-gradient(to right, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 100%), url('/images/abstract-green.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
        color: '#f8fafc' // Force white text on dark background banner
      }}>
        <h1 style={{ fontSize: '36px', marginBottom: 'var(--space-8)', color: '#f8fafc' }}>
          {searchQuery ? `Search Results for "${searchQuery}"` : categoryQuery && categoryQuery !== 'all' ? `${categoryQuery} Courses` : 'Course Catalog'}
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '18px' }}>
          {searchQuery ? `Found ${filteredCourses.length} results.` : 'Discover your next learning adventure.'}
        </p>
      </div>

      {/* Category Filter Pills */}
      {!searchQuery && allCategories.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
          <button 
            onClick={() => setSearchParams({ category: 'all' })} 
            style={{ 
              cursor: 'pointer', padding: '8px 16px', borderRadius: '24px', fontWeight: 500, fontSize: '14px', border: '1px solid var(--border)', 
              background: (!categoryQuery || categoryQuery === 'all') ? 'var(--primary)' : 'var(--surface-2)', 
              color: (!categoryQuery || categoryQuery === 'all') ? 'white' : 'var(--text-primary)',
              transition: 'all 0.2s'
            }}
          >
            All Categories
          </button>
          {allCategories.map(cat => (
            <button 
              key={cat} 
              onClick={() => setSearchParams({ category: cat })}
              style={{ 
                cursor: 'pointer', padding: '8px 16px', borderRadius: '24px', fontWeight: 500, fontSize: '14px', border: '1px solid var(--border)', 
                background: categoryQuery === cat ? 'var(--primary)' : 'var(--surface-2)', 
                color: categoryQuery === cat ? 'white' : 'var(--text-primary)',
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid-cards">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card skeleton" style={{ height: '360px', border: 'none' }}></div>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="card flex-col items-center justify-center" style={{ padding: 'var(--space-64)', textAlign: 'center' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: 'var(--space-16)' }} />
          <h2 className="text-xl">No courses found</h2>
          <p className="text-secondary mt-2">Try adjusting your filters or search query.</p>
        </div>
      ) : (
        <div className="grid-cards">
          {filteredCourses.map(course => (
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
                
                <p className="text-secondary text-sm mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-muted mt-auto mb-4">
                  <div className="flex items-center gap-2">
                    <Star size={14} color="var(--warning)" fill="var(--warning)" />
                    <span className="font-medium text-primary">4.8</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    <span>1.2k students</span>
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
    </div>
  );
};
