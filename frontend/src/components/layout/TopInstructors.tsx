import React from 'react';

import { Card } from '../ui/Card';

export const TopInstructors = () => {
  const instructors = [
    { name: 'Dr. Angela Yu', title: 'Developer & Lead Instructor', img: 'https://randomuser.me/api/portraits/women/44.jpg', students: '2M+', rating: 4.8 },
    { name: 'Maximilian S.', title: 'Frontend Architect', img: 'https://randomuser.me/api/portraits/men/32.jpg', students: '1.5M+', rating: 4.7 },
    { name: 'Jose Portilla', title: 'Data Science Executive', img: 'https://randomuser.me/api/portraits/men/78.jpg', students: '1.2M+', rating: 4.6 },
    { name: 'Stephen Grider', title: 'Engineering Manager', img: 'https://randomuser.me/api/portraits/men/22.jpg', students: '900K+', rating: 4.8 }
  ];

  return (
    <section className="py-20 bg-[var(--surface-1)]">
      <div className="container">
        <h2 className="text-3xl font-bold mb-2 text-center">Learn from Industry Experts</h2>
        <p className="text-[var(--text-secondary)] text-center mb-12">Our instructors are real-world professionals working at top tech companies.</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {instructors.map((inst, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <img src={inst.img} alt={inst.name} className="w-32 h-32 rounded-full mb-4 object-cover border-4 border-[var(--surface-2)] shadow-md" />
              <h3 className="font-bold text-lg">{inst.name}</h3>
              <p className="text-sm text-[var(--text-muted)] mb-2">{inst.title}</p>
              <div className="flex items-center gap-4 text-sm font-medium mt-2">
                <span className="flex items-center gap-1">⭐ {inst.rating}</span>
                <span className="flex items-center gap-1">👥 {inst.students}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};