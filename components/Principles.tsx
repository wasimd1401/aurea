import React from 'react';
import { useInView } from 'react-intersection-observer';

export const Manifesto: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="manifiesto" className="relative py-24 md:py-32 bg-cream-100 overflow-hidden">
      {/* Decorative sphere */}
      <div className="sphere sphere-gradient-1 w-24 h-24 md:w-40 md:h-40 top-10 right-10 animate-float opacity-60" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Label */}
        <div
          className={`mb-12 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="text-pop-magenta text-sm font-bold tracking-widest uppercase">
            — Nuestra Promesa
          </span>
        </div>

        {/* Main Statement */}
        <div
          className={`mb-20 transition-all duration-700 delay-200 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
            Primero Humanos,
          </h2>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="accent-italic gradient-text-fun">IA Segundo.</span>
          </h2>
        </div>

        {/* Two Column Values */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          <div
            className={`transition-all duration-700 delay-300 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Socios, no solo herramientas.
            </h3>
            <p className="text-onyx-700 text-lg leading-relaxed">
              No estamos aquí para reemplazar al dueño—estamos aquí para
              <span className="text-pop-magenta font-semibold"> potenciarlo</span>.
              Construimos sistemas que amplifican tu intuición, no que la anulan.
              Piensa en nosotros como tu co-fundador técnico que maneja la complejidad
              para que tú puedas liderar.
            </p>
          </div>

          <div
            className={`transition-all duration-700 delay-500 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Resultados visibles, cero estrés.
            </h3>
            <p className="text-onyx-700 text-lg leading-relaxed">
              Olvídate del jerga y las curvas de aprendizaje empinadas. Entregamos
              soluciones limpias y funcionales que se integran silenciosamente en tu
              flujo de trabajo. Tú ves las ganancias de eficiencia inmediatamente;
              <span className="text-pop-cyan font-semibold"> nosotros manejamos el código y las actualizaciones</span>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Manifesto;
