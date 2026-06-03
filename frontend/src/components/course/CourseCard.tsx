import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface CourseProps {
  id: number;
  title: string;
  instructor: string;
  rating: number;
  reviews: number;
  price: number;
  thumbnail: string;
  isBestSeller?: boolean;
}

export const CourseCard: React.FC<{ course: CourseProps }> = ({ course }) => {
  const navigate = useNavigate();

  return (
    <Card 
      className="flex flex-col h-full overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-300"
    >
      <div 
        className="relative h-48 w-full bg-cover bg-center bg-gray-200"
        style={{ backgroundImage: `url(${course.thumbnail})` }}
        onClick={() => navigate(`/courses/${course.id}`)}
      >
        {course.isBestSeller && (
          <div className="absolute top-3 left-3">
            <Badge variant="warning">Best Seller</Badge>
          </div>
        )}
      </div>
      
      <div className="p-5 flex flex-col flex-1" onClick={() => navigate(`/courses/${course.id}`)}>
        <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 text-[var(--text-primary)]">
          {course.title}
        </h3>
        <p className="text-sm text-[var(--text-secondary)] mb-3">{course.instructor}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="font-bold text-yellow-500">{course.rating.toFixed(1)}</span>
          <div className="flex text-yellow-400 text-sm">
            {'★'.repeat(Math.floor(course.rating))}
            {'☆'.repeat(5 - Math.floor(course.rating))}
          </div>
          <span className="text-xs text-[var(--text-muted)]">({course.reviews.toLocaleString()})</span>
        </div>
        
        <div className="mt-auto pt-4 border-t border-[var(--border)] flex justify-between items-center">
          <span className="font-bold text-xl">${course.price.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};
