import React from 'react';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-[var(--surface-2)] pt-24 pb-32">
      {/* Decorative background blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--primary)] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-20 right-10 w-72 h-72 bg-[#10b981] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container relative z-10 flex flex-col items-center text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Master the Skills of <br className="hidden md:block" />
          <span className="text-[var(--primary)]">Tomorrow, Today.</span>
        </h1>
        
        <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl">
          Join over 50,000+ students advancing their careers with elite courses from top industry experts.
        </p>

        {/* Global Search Bar */}
        <div className="w-full max-w-3xl flex bg-[var(--surface-1)] p-2 rounded-full shadow-lg border border-[var(--border)] mb-8">
          <input 
            type="text" 
            placeholder="What do you want to learn?" 
            className="flex-1 bg-transparent px-6 py-3 outline-none text-[var(--text-primary)] text-lg"
          />
          <Button size="lg" className="rounded-full px-8" onClick={() => navigate('/courses')}>
            Search
          </Button>
        </div>

        {/* Popular Skills */}
        <div className="flex flex-wrap justify-center gap-3">
          <span className="text-sm font-medium text-[var(--text-muted)] mt-2">Popular:</span>
          {['Python', 'React', 'Data Science', 'AWS', 'Machine Learning'].map(skill => (
            <button key={skill} className="badge badge-neutral hover:bg-[var(--surface-3)] transition">
              {skill}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};