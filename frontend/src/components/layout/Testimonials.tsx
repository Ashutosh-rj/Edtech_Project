import React from 'react';

import { Card, CardBody } from '../ui/Card';

export const Testimonials = () => {
  const testimonials = [
    { name: 'Sarah Jenkins', role: 'Software Engineer @ Google', quote: 'I transitioned from marketing to software engineering purely through these courses. The curriculum is incredibly structured.' },
    { name: 'David Chen', role: 'Data Scientist @ Amazon', quote: 'The machine learning track is phenomenal. It goes deep into the math but keeps the code extremely practical.' },
    { name: 'Emily Rodriguez', role: 'UX Designer @ Meta', quote: 'A life-changing platform. The instructors are clearly experts in their field and the community support is unmatched.' }
  ];

  return (
    <section className="py-20 bg-[var(--surface-1)]">
      <div className="container">
        <h2 className="text-3xl font-bold mb-12 text-center">How EliteEd changed lives</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <Card key={i} className="h-full">
              <CardBody className="p-8 flex flex-col h-full">
                <div className="text-4xl text-[var(--primary)] mb-4">"</div>
                <p className="text-lg text-[var(--text-primary)] font-medium mb-8 flex-1">
                  {t.quote}
                </p>
                <div className="border-t border-[var(--border)] pt-4 mt-auto">
                  <h4 className="font-bold">{t.name}</h4>
                  <p className="text-sm text-[var(--text-muted)]">{t.role}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};