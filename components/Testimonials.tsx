import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Check, ArrowRight, Star } from 'lucide-react';

interface PricingTier {
  name: string;
  tagline: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'LA AUDITORÍA',
    tagline: 'Para empezar',
    price: '$5,000',
    period: 'único',
    features: [
      'Análisis profundo de tu negocio',
      'Identificación de cuellos de botella',
      'Mapa de implementación',
      'ROI proyectado',
    ],
    cta: 'Lo quiero',
  },
  {
    name: 'EL ARQUITECTO',
    tagline: 'Más popular',
    price: '$15,000',
    period: '/mes',
    features: [
      'Todo en La Auditoría',
      'Construcción completa de tu sistema',
      'Entrenamiento personalizado',
      'Loops de crecimiento ilimitados',
      'Sincronías de estrategia semanales',
      'Acceso a soporte VIP',
    ],
    cta: '¡Vamos!',
    highlighted: true,
  },
  {
    name: 'EL SOCIO',
    tagline: 'Para los serios',
    price: 'Custom',
    period: '',
    features: [
      'Estrategia a nivel directivo',
      'Entrada a nuevos mercados',
      'Automatización de prep para exit',
      'Retainer dedicado',
    ],
    cta: 'Hablemos',
  },
];

export const Pricing: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: quoteRef, inView: quoteInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <>
      {/* Pricing Section */}
      <section id="precios" className="relative py-24 md:py-32 section-dark overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-pop-cyan/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pop-magenta/20 rounded-full blur-3xl" />
        </div>

        <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div
            className={`text-center mb-16 transition-all duration-700 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              Elige Tu <span className="accent-italic gradient-text-fun">Velocidad</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Sin cobros por hora. Solo resultados que ponen nerviosos a tus competidores.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-8 transition-all duration-500 ${
                  tier.highlighted ? 'card-highlight scale-105' : 'card-dark'
                } ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${idx * 150}ms` }}
              >
                {/* Tag */}
                {tier.highlighted && (
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pop-cyan/20 text-pop-cyan text-xs font-bold mb-4">
                    <Star className="w-3 h-3 fill-pop-cyan" />
                    {tier.tagline}
                  </div>
                )}
                {!tier.highlighted && (
                  <p className="text-gray-500 text-sm mb-4">{tier.tagline}</p>
                )}

                {/* Name */}
                <h3 className="text-xl font-bold mb-4">{tier.name}</h3>

                {/* Price */}
                <div className="mb-6">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-gray-500 ml-1">{tier.period}</span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-gray-300">
                      <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${tier.highlighted ? 'text-pop-cyan' : 'text-gray-500'}`} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <button
                  className={`w-full py-4 rounded-full font-semibold transition-all ${
                    tier.highlighted
                      ? 'btn-gradient'
                      : 'border border-gray-700 hover:border-white hover:bg-white/5'
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="relative py-24 md:py-32 bg-cream-50 overflow-hidden">
        {/* Decorative spheres */}
        <div className="sphere sphere-gradient-1 w-20 h-20 top-10 left-10 animate-float opacity-40" />
        <div className="sphere sphere-gradient-2 w-16 h-16 bottom-20 right-20 animate-float-delayed opacity-40" />

        <div ref={quoteRef} className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div
            className={`transition-all duration-1000 ${
              quoteInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <blockquote className="text-2xl md:text-4xl font-bold leading-relaxed mb-8">
              "ONYX AI no solo nos dio herramientas; nos devolvieron
              <span className="gradient-text-warm"> nuestra vida</span>. Estamos facturando 5x más
              y la verdad es que estoy en la playa."
            </blockquote>

            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pop-cyan to-pop-magenta flex items-center justify-center text-white font-bold">
                EV
              </div>
              <div className="text-left">
                <p className="font-bold">Elena Vance</p>
                <p className="text-onyx-700 text-sm">CEO, Vance Capital Groups</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Pricing;
