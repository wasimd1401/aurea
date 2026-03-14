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
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Elige el plan perfecto para ti
            </h1>
            <p className="text-lg text-surface-500 max-w-xl mx-auto">
              Todos los planes incluyen acceso a nuestras herramientas de IA. Cancela cuando quieras.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`rounded-xl p-8 border transition-colors ${
                  tier.highlighted
                    ? 'bg-accent/5 border-accent/30 ring-1 ring-accent/20'
                    : 'bg-surface-100 border-surface-200 hover:border-surface-300'
                }`}
              >
                {tier.highlighted && (
                  <div className="text-xs font-semibold text-accent uppercase tracking-wider mb-4">
                    Más popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <div className="mt-4 mb-2">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-surface-500 text-sm">{tier.period}</span>
                </div>
                <p className="text-sm text-surface-500 mb-6">{tier.description}</p>
                <Link
                  to="/signup"
                  className={`block text-center py-3 px-6 rounded-lg font-semibold text-sm transition-colors mb-8 ${
                    tier.highlighted
                      ? 'bg-accent hover:bg-accent-light text-black'
                      : 'bg-surface-200 hover:bg-surface-300 text-white'
                  }`}
                >
                  {tier.cta}
                </Link>
                <ul className="space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-surface-600">
                      <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
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
