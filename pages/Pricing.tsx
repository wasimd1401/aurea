import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';
import { PRICING_TIERS } from '../constants';

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Navbar */}
      <nav className="bg-surface/80 backdrop-blur-xl border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">O</span>
            </div>
            <span className="text-lg font-bold text-white">Onyx Labs</span>
          </Link>
          <Link to="/" className="flex items-center gap-2 text-sm text-surface-500 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Volver
          </Link>
        </div>
      </nav>

      <div className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Precios de lanzamiento. 🔒 Bloquéalos hoy.
            </h1>
            <p className="text-lg text-surface-500 max-w-xl mx-auto">
              Los miembros fundadores mantienen este precio para siempre.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-2xl p-7 border transition-all duration-300 h-full relative group ${
                  tier.highlighted
                    ? 'bg-accent/5 border-accent/40 ring-2 ring-accent/20 hover:ring-accent/40 hover:border-accent/60 hover:shadow-xl hover:shadow-accent/10 scale-[1.02]'
                    : 'bg-surface-100 border-surface-200 hover:border-surface-300 hover:bg-surface-50 hover:shadow-lg hover:shadow-black/20'
                }`}
              >
                {tier.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-accent text-black text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    ⭐ RECOMENDADO
                  </div>
                )}
                <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                <div className="mt-3 mb-1.5">
                  <span className="text-3xl font-extrabold text-white">{tier.price}</span>
                  <span className="text-surface-500 text-sm">{tier.period}</span>
                </div>
                <p className="text-xs text-surface-500 mb-5 leading-relaxed">{tier.description}</p>
                <Link
                  to="/signup"
                  className={`block text-center py-2.5 px-5 rounded-xl font-semibold text-sm transition-all mb-6 ${
                    tier.highlighted
                      ? 'bg-accent hover:bg-accent-light text-black hover:shadow-lg hover:shadow-accent/20'
                      : 'bg-surface-200 hover:bg-surface-300 text-white'
                  }`}
                >
                  {tier.cta}
                </Link>
                <ul className="space-y-2.5">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-surface-600">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlighted ? 'text-accent' : 'text-surface-400'}`} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-base text-surface-500">
              🛡️ Garantía de 7 días — Si no te convence, te devolvemos el 100%.
            </p>
          </div>

          <div className="mt-8 text-center">
            <p className="text-surface-500 text-sm">
              ¿Necesitas un plan personalizado?{' '}
              <a href="mailto:hola@onyxlabs.ai" className="text-accent hover:text-accent-light font-medium">
                Contáctanos
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
