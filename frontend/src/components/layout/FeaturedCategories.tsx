import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody } from '../ui/Card';

const CATEGORIES = [
  { id: 1, name: 'Web Development', count: 120, icon: '💻', color: 'bg-blue-100 text-blue-600' },
  { id: 2, name: 'Data Science', count: 85, icon: '📊', color: 'bg-green-100 text-green-600' },
  { id: 3, name: 'Design', count: 42, icon: '🎨', color: 'bg-pink-100 text-pink-600' },
  { id: 4, name: 'Marketing', count: 64, icon: '📈', color: 'bg-yellow-100 text-yellow-600' },
  { id: 5, name: 'Business', count: 90, icon: '💼', color: 'bg-purple-100 text-purple-600' },
  { id: 6, name: 'Photography', count: 28, icon: '📸', color: 'bg-indigo-100 text-indigo-600' },
  { id: 7, name: 'Music', count: 15, icon: '🎵', color: 'bg-red-100 text-red-600' },
  { id: 8, name: 'IT & Software', count: 150, icon: '⚙️', color: 'bg-gray-100 text-gray-600' },
];

export const FeaturedCategories = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-[var(--surface-1)]">
      <div className="container">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Explore Top Categories</h2>
            <p className="text-[var(--text-secondary)]">Find the perfect course to advance your career</p>
          </div>
          <button 
            className="hidden sm:block text-[var(--primary)] font-medium hover:underline"
            onClick={() => navigate('/categories')}
          >
            Browse All Categories &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map(category => (
            <Card 
              key={category.id} 
              className="cursor-pointer hover:-translate-y-1 transition-transform duration-300"
            >
              <CardBody className="flex items-center gap-4 p-6" onClick={() => navigate(`/categories/${category.id}`)}>
                <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl ${category.color}`}>
                  {category.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-[var(--text-primary)]">{category.name}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{category.count} Courses</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};