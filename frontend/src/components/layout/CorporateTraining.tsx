import React from 'react';

import { Button } from '../ui/Button';

export const CorporateTraining = () => {
  return (
    <section className="py-20 bg-[var(--surface-2)]">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center bg-[var(--surface-1)] border border-[var(--border)] rounded-[var(--radius-xl)] overflow-hidden shadow-lg">
          <div className="flex-1 p-12 lg:p-20">
            <h2 className="text-4xl font-bold mb-4">Upskill your team with EliteEd</h2>
            <p className="text-lg text-[var(--text-secondary)] mb-8 max-w-lg">
              Unlimited access to 5,000+ top courses, analytics, and certification paths for your entire workforce.
            </p>
            <Button size="lg">Get EdTech for Business</Button>
          </div>
          <div className="flex-1 h-full min-h-[300px] w-full bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80')" }}>
          </div>
        </div>
      </div>
    </section>
  );
};