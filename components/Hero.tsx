import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center overflow-hidden bg-cream-50 pt-24 pb-16">
      {/* 3D Spheres */}
      <div className="sphere sphere-gradient-1 w-32 h-32 md:w-48 md:h-48 top-20 right-10 md:right-20 animate-float" />
      <div className="sphere sphere-gradient-2 w-16 h-16 md:w-24 md:h-24 top-40 right-40 md:right-60 animate-float-delayed" />
      <div className="sphere sphere-gradient-3 w-20 h-20 md:w-32 md:h-32 bottom-32 left-10 animate-float-delayed" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pop-cyan/10 border border-pop-cyan/30 mb-8">
            <Sparkles className="w-4 h-4 text-pop-cyan" />
            <span className="text-sm font-medium text-onyx-700">Automatización inteligente para PyMEs</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8">
            <span className="block">Recupera tus</span>
            <span className="block accent-italic gradient-text-warm">Sábados.</span>
            <span className="block mt-2">En serio.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-onyx-700 max-w-xl mb-10 leading-relaxed">
            Onyx construye herramientas de IA que manejan lo repetitivo,
            para que tú no tengas que hacerlo. Deja de trabajar los fines de semana.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a
              href="#contacto"
              className="group btn-dark px-8 py-4 rounded-full font-semibold flex items-center gap-3"
            >
              <span>Empecemos</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#servicios"
              className="btn-outline px-8 py-4 rounded-full font-semibold"
            >
              Ver la magia
            </a>
          </div>
        </div>

        {/* Gradient blob decoration */}
        <div className="hidden md:block absolute bottom-20 left-1/2 w-64 h-16 blob-gradient opacity-60" />
      </div>

      {/* Marquee Strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-onyx-950 py-4 overflow-hidden">
        <div className="animate-marquee flex whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 mx-4">
              <span className="text-white font-bold tracking-widest">EFICIENCIA</span>
              <span className="text-pop-cyan">✦</span>
              <span className="text-white font-bold tracking-widest">LIBERTAD</span>
              <span className="text-pop-magenta">✦</span>
              <span className="text-white font-bold tracking-widest">CRECIMIENTO</span>
              <span className="text-pop-pink">✦</span>
              <span className="text-white font-bold tracking-widest">AUTOMATIZACIÓN</span>
              <span className="text-pop-orange">✦</span>
              <span className="text-white font-bold tracking-widest">RESULTADOS</span>
              <span className="text-pop-lime">✦</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
