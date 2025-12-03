import React from 'react';
import { CONTENT } from '../constants';
import { Language } from '../types';
import { ChevronDown, ArrowRight } from 'lucide-react';

interface HeroProps {
  lang: Language;
}

const Hero: React.FC<HeroProps> = ({ lang }) => {
  const content = CONTENT[lang].hero;

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 bg-white text-austral-dark overflow-hidden pt-32 pb-16">
      
      {/* Background - Clean White */}
      <div className="absolute inset-0 z-0 bg-white"></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid md:grid-cols-12 gap-16 items-center">
        
        {/* Typography Column */}
        <div className="md:col-span-7 space-y-10">
          <div className="flex items-center gap-4">
             <div className="h-[1px] w-12 bg-austral-clay"></div>
             <span className="text-austral-clay font-bold tracking-[0.2em] text-xs uppercase">{content.eyebrow}</span>
          </div>
          
          <div className="space-y-4">
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-austral-dark tracking-tight">
              {content.headline}
            </h1>
            <p className="font-serif italic text-3xl md:text-4xl text-austral-clay">
                {content.tagline}
            </p>
          </div>

          <p className="text-xl font-light max-w-lg leading-relaxed text-gray-800 whitespace-pre-line">
            {content.description}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <a 
              href="#contact" 
              className="bg-austral-dark text-white px-8 py-4 font-serif italic text-xl hover:bg-austral-clay transition-all duration-300 shadow-xl shadow-gray-200/50 hover:scale-[1.02] hover:shadow-2xl"
            >
              {content.cta}
            </a>
            <a href="#services" className="group flex items-center gap-2 font-medium text-austral-dark text-sm tracking-widest uppercase border-b border-transparent hover:border-austral-dark transition-all py-2">
                {content.ctaSecondary}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Metrics Strip */}
          <div className="pt-12 grid grid-cols-3 gap-8 border-t border-gray-100 mt-12 max-w-lg">
            {content.metrics?.map((metric, i) => (
              <div key={i}>
                <p className="font-serif text-3xl font-bold text-austral-dark">{metric.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-gray-500 mt-1">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Column - Minimal B&W Architecture */}
        <div className="md:col-span-5 hidden md:flex flex-col justify-center h-full relative">
            <div className="aspect-[3/4] relative overflow-hidden">
                 {/* Extremely Minimal Architectural Detail - B&W - Reliable Source */}
                 <img 
                    src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1000&auto=format&fit=crop" 
                    alt="AUREA Minimalism" 
                    className="w-full h-full object-cover grayscale contrast-125 opacity-90 hover:opacity-100 transition-all duration-[1.5s]"
                />
            </div>
        </div>

      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-austral-clay/30">
        <ChevronDown size={24} />
      </div>
    </section>
  );
};

export default Hero;