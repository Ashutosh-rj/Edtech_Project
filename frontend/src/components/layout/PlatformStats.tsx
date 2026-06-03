import React from 'react';

export const PlatformStats = () => {
  const stats = [
    { label: 'Active Students', value: '50K+' },
    { label: 'Quality Courses', value: '1,200+' },
    { label: 'Expert Instructors', value: '300+' },
    { label: 'Success Rate', value: '94%' }
  ];

  return (
    <section className="py-12 bg-[var(--primary)] text-white">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm uppercase tracking-wide opacity-80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};