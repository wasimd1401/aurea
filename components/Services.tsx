import React from 'react';
import { CONTENT } from '../constants';
import { Language } from '../types';
import { CheckCircle2 } from 'lucide-react';

interface ServicesProps {
  lang: Language;
}

const Services: React.FC<ServicesProps> = ({ lang }) => {
  const content = CONTENT[lang].services;

  return (
    <section id="services" className="bg-austral-dark text-white relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white max-w-2xl leading-tight">
            {content.title}
          </h2>
          <p className="mt-4 text-gray-300 max-w-xl text-sm uppercase tracking-widest font-medium">
            {content.subtitle}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {content.items.map((item) => (
            <div key={item.title} className="border border-white/10 bg-white/5 p-8 rounded-2xl">
              <h3 className="text-2xl font-serif text-austral-gold mb-4">{item.title}</h3>
              <p className="text-gray-200 leading-relaxed mb-6">{item.description}</p>
              <ul className="space-y-3">
                {item.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-center gap-3 text-sm text-gray-200">
                    <CheckCircle2 className="w-4 h-4 text-austral-clay" />
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
