import React from 'react';
import { CONTENT } from '../constants';
import { Language } from '../types';
import { ShieldCheck } from 'lucide-react';

interface AboutProps {
  lang: Language;
}

const About: React.FC<AboutProps> = ({ lang }) => {
  const content = CONTENT[lang].about;

  return (
    <section id="about" className="bg-black text-white py-24 md:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">{content.title}</h2>
          <p className="mt-4 text-gray-300 max-w-xl text-sm uppercase tracking-widest font-medium">{content.subtitle}</p>
          <ul className="mt-10 space-y-5">
            {content.highlights.map((item) => (
              <li key={item} className="text-gray-200 leading-relaxed flex gap-3">
                <ShieldCheck className="w-5 h-5 text-austral-gold mt-1" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-white/10 bg-white/5 p-8 rounded-2xl">
          <h3 className="text-xl font-serif text-austral-gold mb-4">Trust markers</h3>
          <ul className="space-y-4 text-sm text-gray-200">
            {content.trustMarkers.map((marker) => (
              <li key={marker}>• {marker}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default About;
