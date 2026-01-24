import React from 'react';
import { CONTENT } from '../constants';
import { Language } from '../types';
import { ArrowRight } from 'lucide-react';

interface ProcessProps {
  lang: Language;
}

const Process: React.FC<ProcessProps> = ({ lang }) => {
  const content = CONTENT[lang].process;

  return (
    <section id="process" className="bg-austral-dark text-white py-24 md:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white max-w-2xl leading-tight">{content.title}</h2>
          <p className="mt-4 text-gray-300 max-w-xl text-sm uppercase tracking-widest font-medium">{content.subtitle}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {content.steps.map((step, index) => (
            <div key={step.title} className="border border-white/10 bg-white/5 p-6 rounded-2xl relative">
              <span className="text-xs uppercase tracking-widest text-austral-gold">Step {index + 1}</span>
              <h3 className="text-2xl font-serif text-white mt-3 mb-3">{step.title}</h3>
              <p className="text-gray-200 text-sm leading-relaxed">{step.description}</p>
              {index < content.steps.length - 1 && (
                <ArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-austral-clay" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Process;
