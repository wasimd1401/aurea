import React from 'react';
import { CONTENT } from '../constants';
import { Language } from '../types';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const content = CONTENT[lang].hero;

  return (
    <section id="top" className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 bg-austral-dark text-white overflow-hidden pt-36 pb-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-austral-dark via-black to-austral-dark"></div>
        <div className="absolute top-10 right-10 w-[420px] h-[420px] bg-austral-clay/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-10 left-0 w-[320px] h-[320px] bg-austral-gold/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-7 space-y-10">
          <div className="flex items-center gap-4">
            <div className="h-[1px] w-12 bg-austral-clay"></div>
            <span className="text-austral-gold font-semibold tracking-[0.3em] text-xs uppercase">{content.eyebrow}</span>
          </div>

          <div className="space-y-4">
            <h1 className="font-serif text-5xl md:text-7xl leading-[1.05] text-white tracking-tight">
              {content.headline}
            </h1>
            <p className="font-serif italic text-2xl md:text-3xl text-austral-clay">
              {content.tagline}
            </p>
          </div>

          <p className="text-lg md:text-xl font-light max-w-2xl leading-relaxed text-gray-200">
            {content.description}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <a
              href="#contact"
              className="bg-austral-clay text-white px-8 py-4 font-semibold text-lg hover:bg-austral-gold hover:text-austral-dark transition-all duration-300 shadow-xl shadow-black/40"
            >
              {content.cta}
            </a>
            <a
              href="#services"
              className="group flex items-center gap-2 font-medium text-gray-200 text-sm tracking-widest uppercase border-b border-transparent hover:border-white transition-all py-2"
            >
              {content.ctaSecondary}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-5 hidden lg:flex flex-col justify-center h-full relative">
          <div className="aspect-[3/4] relative overflow-hidden rounded-2xl border border-white/10">
            <img
              src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=1400&auto=format&fit=crop"
              alt="Small business team collaborating"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-austral-dark/80 to-transparent"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
