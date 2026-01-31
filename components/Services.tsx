import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Zap, MessageCircle, BarChart3, ArrowRight } from 'lucide-react';

interface Service {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const services: Service[] = [
  {
    icon: Zap,
    title: 'Magia de Flujos',
    description:
      'Automatiza facturación, emails, clasificación y agendamiento. Mira cómo tu lista de pendientes se vacía automáticamente, sin mover un dedo.',
    color: 'text-pop-orange',
    bgColor: 'bg-pop-orange/10',
  },
  {
    icon: BarChart3,
    title: 'Insights de Clientes',
    description:
      'Sabe exactamente qué quieren tus clientes antes de que lo pidan. Nuestra IA analiza tendencias para que puedas actuar rápido y mantenerte adelante.',
    color: 'text-pop-cyan',
    bgColor: 'bg-pop-cyan/10',
  },
  {
    icon: MessageCircle,
    title: 'Configúralo y Olvídalo',
    description:
      'Despliega bots inteligentes que manejan soporte al cliente y calificación de leads 24/7, incluso mientras duermes.',
    color: 'text-pop-magenta',
    bgColor: 'bg-pop-magenta/10',
  },
];

export const Services: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="servicios" className="relative py-24 md:py-32 bg-cream-50">
      {/* Decorative elements */}
      <div className="sphere sphere-gradient-2 w-20 h-20 bottom-20 right-20 animate-float opacity-40" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Impactos <span className="accent-italic">Prácticos</span>
          </h2>
          <p className="text-onyx-700 text-lg max-w-xl mx-auto">
            Herramientas reales para problemas reales de negocios.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className={`card-light rounded-3xl p-8 transition-all duration-500 ${
                  inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Icon */}
                <div className={`${service.bgColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                  <Icon className={`w-7 h-7 ${service.color}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-onyx-700 leading-relaxed mb-6">{service.description}</p>

                {/* Link */}
                <a
                  href="#contacto"
                  className={`inline-flex items-center gap-2 font-semibold ${service.color} hover:gap-3 transition-all`}
                >
                  Ver más
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
