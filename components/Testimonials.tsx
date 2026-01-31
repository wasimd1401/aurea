import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Blocks, Wand2, Users, Rocket, Code2, Sparkles } from 'lucide-react';

interface PhilosophyPoint {
  icon: React.ElementType;
  title: string;
  description: string;
}

const philosophyPoints: PhilosophyPoint[] = [
  {
    icon: Blocks,
    title: 'Sin Código, Sin Límites',
    description:
      'Usamos herramientas no-code y low-code que tú mismo puedes modificar. Nada de depender de programadores para cada cambio pequeño.',
  },
  {
    icon: Users,
    title: 'Tú al Mando',
    description:
      'Te entregamos sistemas que entiendes y controlas. Si quieres cambiar algo, lo cambias. Sin tickets de soporte, sin esperas.',
  },
  {
    icon: Rocket,
    title: 'Velocidad de Startup',
    description:
      'Lo que antes tomaba meses y equipos de 10 personas, ahora lo hacemos en semanas. Y tú puedes iterarlo en minutos.',
  },
];

export const Philosophy: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: bottomRef, inView: bottomInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      {/* Philosophy Section */}
      <section id="filosofia" className="relative py-24 md:py-32 section-dark overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-pop-cyan/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pop-magenta/20 rounded-full blur-3xl" />
        </div>

        <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div
            className={`mb-16 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <span className="text-pop-cyan text-sm font-bold tracking-widest uppercase mb-4 block">
              — Nuestra Filosofía
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Un equipo de 1 con el
              <br />
              <span className="accent-italic gradient-text-fun">poder de 100.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl">
              Creemos que la tecnología debe multiplicar tu capacidad, no complicarte la vida.
              Por eso construimos todo con herramientas que cualquier persona puede usar.
            </p>
          </div>

          {/* Main Message Card */}
          <div
            className={`bg-onyx-800 rounded-3xl p-8 md:p-12 mb-12 transition-all duration-700 delay-200 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex items-start gap-6">
              <div className="hidden md:flex w-16 h-16 rounded-2xl bg-gradient-to-br from-pop-cyan to-pop-magenta items-center justify-center flex-shrink-0">
                <Code2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  ¿Por qué No-Code?
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Porque no necesitas ser ingeniero para tener sistemas de ingeniero. Usamos
                  plataformas como <span className="text-pop-cyan font-semibold">Make</span>,{' '}
                  <span className="text-pop-magenta font-semibold">Zapier</span>,{' '}
                  <span className="text-pop-orange font-semibold">Airtable</span>, y{' '}
                  <span className="text-pop-pink font-semibold">herramientas de IA</span> que
                  cualquier persona puede aprender en una tarde.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  El resultado: sistemas que antes requerían equipos de desarrollo completos,
                  ahora los manejas tú solo. Sin código, sin dependencias, sin dolores de cabeza.
                  <span className="text-white font-semibold"> Solo resultados.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Philosophy Points */}
          <div className="grid md:grid-cols-3 gap-6">
            {philosophyPoints.map((point, idx) => {
              const Icon = point.icon;
              return (
                <div
                  key={idx}
                  className={`bg-onyx-800/50 border border-gray-800 rounded-2xl p-6 transition-all duration-500 hover:border-pop-cyan/30 ${
                    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                  }`}
                  style={{ transitionDelay: `${300 + idx * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pop-cyan/20 to-pop-magenta/20 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-pop-cyan" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{point.title}</h3>
                  <p className="text-gray-400">{point.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Empowerment Statement */}
      <section className="relative py-24 md:py-32 bg-cream-50 overflow-hidden">
        {/* Decorative spheres */}
        <div className="sphere sphere-gradient-1 w-24 h-24 top-10 left-10 animate-float opacity-40" />
        <div className="sphere sphere-gradient-2 w-20 h-20 bottom-20 right-20 animate-float-delayed opacity-40" />

        <div ref={bottomRef} className="relative z-10 max-w-5xl mx-auto px-6">
          <div
            className={`text-center transition-all duration-1000 ${
              bottomInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pop-magenta/10 border border-pop-magenta/30 mb-8">
              <Sparkles className="w-4 h-4 text-pop-magenta" />
              <span className="text-sm font-medium text-onyx-700">Nuestra Promesa</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-8">
              No te vamos a dejar con un sistema que
              <span className="accent-italic gradient-text-warm"> no entiendes.</span>
            </h2>

            <p className="text-onyx-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Cada automatización, cada flujo, cada integración que construimos está diseñada
              para que <span className="font-semibold">tú la entiendas y la controles</span>.
              Te enseñamos a pescar, no solo te damos el pescado. Porque tu negocio es tuyo,
              y tu tecnología también debería serlo.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Philosophy;
