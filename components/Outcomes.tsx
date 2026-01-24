import React from 'react';
import { CONTENT } from '../constants';
import { Language } from '../types';

interface OutcomesProps {
  lang: Language;
}

const Outcomes: React.FC<OutcomesProps> = ({ lang }) => {
  const content = CONTENT[lang].outcomes;

  return (
    <section id="outcomes" className="bg-black text-white py-24 md:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white max-w-2xl leading-tight">{content.title}</h2>
          <p className="mt-4 text-gray-300 max-w-xl text-sm uppercase tracking-widest font-medium">{content.subtitle}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {content.items.map((item) => (
            <div key={item.title} className="border border-white/10 bg-white/5 p-6 rounded-2xl h-full">
              <p className="text-xs uppercase tracking-widest text-austral-gold">{item.industry}</p>
              <h3 className="text-2xl font-serif text-white mt-3 mb-3">{item.title}</h3>
              <p className="text-austral-clay font-semibold mb-4">{item.result}</p>
              <p className="text-gray-200 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Outcomes;
