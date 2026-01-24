import React from 'react';
import { CONTENT } from '../constants';
import { Language } from '../types';

interface PrivacyProps {
  lang: Language;
}

const Privacy: React.FC<PrivacyProps> = ({ lang }) => {
  const content = CONTENT[lang].privacy;

  return (
    <section id="privacy" className="bg-austral-dark text-white py-24 md:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">{content.title}</h2>
        <p className="mt-6 text-gray-300 max-w-3xl leading-relaxed">{content.description}</p>
        <ul className="mt-8 space-y-4 text-sm text-gray-200">
          {content.details.map((detail) => (
            <li key={detail} className="border-l-2 border-austral-clay pl-4">
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Privacy;
