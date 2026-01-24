import React from 'react';
import { CONTENT } from '../constants';
import { Language } from '../types';

interface FaqsProps {
  lang: Language;
}

const Faqs: React.FC<FaqsProps> = ({ lang }) => {
  const content = CONTENT[lang].faqs;

  return (
    <section id="faqs" className="bg-austral-dark text-white py-24 md:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-white max-w-2xl leading-tight">{content.title}</h2>
          <p className="mt-4 text-gray-300 max-w-xl text-sm uppercase tracking-widest font-medium">{content.subtitle}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {content.items.map((item) => (
            <div key={item.question} className="border border-white/10 bg-white/5 p-6 rounded-2xl">
              <h3 className="text-lg font-semibold text-austral-gold mb-3">{item.question}</h3>
              <p className="text-gray-200 text-sm leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Faqs;
