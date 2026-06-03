import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseCard } from '../course/CourseCard';

const DUMMY_COURSES = [
  {
    id: 1,
    title: 'The Complete Web Development Bootcamp 2026',
    instructor: 'Dr. Angela Yu',
    rating: 4.8,
    reviews: 241590,
    price: 89.99,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&q=80',
    isBestSeller: true
  },
  {
    id: 2,
    title: 'Machine Learning A-Z™: Hands-On Python & R',
    instructor: 'Kirill Eremenko',
    rating: 4.7,
    reviews: 168230,
    price: 94.99,
    thumbnail: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=500&q=80',
    isBestSeller: true
  },
  {
    id: 3,
    title: 'React - The Complete Guide (incl Hooks, React Router)',
    instructor: 'Maximilian Schwarzmüller',
    rating: 4.9,
    reviews: 189000,
    price: 79.99,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=500&q=80',
    isBestSeller: false
  },
  {
    id: 4,
    title: 'iOS & Swift - The Complete iOS App Development Bootcamp',
    instructor: 'Dr. Angela Yu',
    rating: 4.8,
    reviews: 98000,
    price: 84.99,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=500&q=80',
    isBestSeller: false
  }
];

export const TrendingCourses = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[var(--background)] border-b border-[var(--border)]">
      <div className="container">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Top Trending Courses</h2>
            <p className="text-[var(--text-secondary)]">Learn from real-world experts and level up your skills.</p>
          </div>
          <button 
            className="hidden sm:block text-[var(--primary)] font-medium hover:underline"
            onClick={() => navigate('/courses')}
          >
            See all courses &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DUMMY_COURSES.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};