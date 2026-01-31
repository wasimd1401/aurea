import React from 'react';
import { useInView } from 'react-intersection-observer';
import { MessageCircle, Map, Rocket } from 'lucide-react';

interface Step {
  icon: React.ElementType;
  number: string;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const steps: Step[] = [
  {
    icon: MessageCircle,
    number: '01',
    title: 'La Charla',
    description: 'Escuchamos tus dolores de negocio. Sin jerga, sin ventas agresivas.',
    color: 'text-pop-cyan',
    bgColor: 'bg-pop-cyan',
  },
  {
    icon: Map,
    number: '02',
    title: 'El Plano',
    description: 'Mapeamos las soluciones simples. Tú apruebas, nosotros construimos.',
    color: 'text-pop-magenta',
    bgColor: 'bg-pop-magenta',
  },
  {
    icon: Rocket,
    number: '03',
    title: 'El Lanzamiento',
    description: 'Nosotros manejamos la tecnología, tú disfrutas los resultados.',
    color: 'text-pop-orange',
    bgColor: 'bg-pop-orange',
  },
];

export const Process: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="proceso" className="relative py-24 md:py-32 bg-cream-100">
      {/* Decorative spheres */}
      <div className="sphere sphere-gradient-3 w-16 h-16 top-20 left-10 animate-float opacity-50" />
      <div className="sphere sphere-gradient-1 w-12 h-12 bottom-32 right-20 animate-float-delayed opacity-50" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Cómo <span className="accent-italic gradient-text-warm">Colaboramos.</span>
          </h2>
          <p className="text-onyx-700 text-lg max-w-xl mx-auto">
            Tres pasos simples hacia la automatización. Cero palabras raras.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`text-center transition-all duration-700 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${idx * 200}ms` }}
              >
                {/* Icon Circle */}
                <div className="relative inline-block mb-6">
                  <div
                    className={`w-20 h-20 ${step.bgColor} rounded-full flex items-center justify-center shadow-lg`}
                    style={{
                      boxShadow: `0 10px 40px ${
                        step.color === 'text-pop-cyan'
                          ? 'rgba(0, 229, 255, 0.3)'
                          : step.color === 'text-pop-magenta'
                          ? 'rgba(255, 0, 229, 0.3)'
                          : 'rgba(255, 138, 80, 0.3)'
                      }`,
                    }}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                <p className="text-onyx-700">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Connecting line (desktop only) */}
        <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-pop-cyan via-pop-magenta to-pop-orange opacity-20 -z-10" />
      </div>
    </section>
  );
};

export default Process;
