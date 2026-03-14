import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, Image, Mic, BarChart3, Globe, Zap, Menu, X } from 'lucide-react';
import { FEATURES, PRICING_TIERS } from '../constants';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Sparkles, Image, Mic, BarChart3, Globe, Zap,
};

const Landing: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-surface font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-surface-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">O</span>
            </div>
            <span className="text-lg font-bold text-white">Onyx Labs</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-surface-600 hover:text-white transition-colors">Características</a>
            <a href="#pricing" className="text-sm text-surface-600 hover:text-white transition-colors">Precios</a>
            <Link to="/login" className="text-sm text-surface-600 hover:text-white transition-colors">Iniciar sesión</Link>
            <Link to="/signup" className="bg-accent hover:bg-accent-light text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Comenzar gratis
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-surface-100 border-b border-surface-200 px-6 py-4 space-y-3">
            <a href="#features" onClick={() => setMenuOpen(false)} className="block text-sm text-surface-600 hover:text-white">Características</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="block text-sm text-surface-600 hover:text-white">Precios</a>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm text-surface-600 hover:text-white">Iniciar sesión</Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)} className="block bg-accent text-black text-sm font-semibold px-4 py-2 rounded-lg text-center">
              Comenzar gratis
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-accent font-medium">Plataforma de contenido con IA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            Crea contenido que
            <br />
            <span className="text-accent">impulsa tu negocio</span>
          </h1>

          <p className="text-lg sm:text-xl text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            La plataforma de IA diseñada para emprendedores hispanohablantes. Genera textos, imágenes y estrategias de contenido en minutos.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="w-full sm:w-auto bg-accent hover:bg-accent-light text-black font-semibold px-8 py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-base"
            >
              Comenzar gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#features"
              className="w-full sm:w-auto border border-surface-300 hover:border-surface-400 text-white font-medium px-8 py-3.5 rounded-lg transition-colors text-center text-base"
            >
              Ver características
            </a>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '10K+', label: 'Usuarios activos' },
              { value: '1M+', label: 'Contenidos creados' },
              { value: '4.9★', label: 'Valoración' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-xs sm:text-sm text-surface-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Todo lo que necesitas para crear contenido
            </h2>
            <p className="text-lg text-surface-500 max-w-2xl mx-auto">
              Herramientas potentes de IA diseñadas específicamente para emprendedores que hablan español.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feature) => {
              const Icon = iconMap[feature.icon] || Sparkles;
              return (
                <div
                  key={feature.title}
                  className="bg-surface-100 border border-surface-200 rounded-xl p-6 hover:border-surface-300 transition-colors group"
                >
                  <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-surface-500 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Precios simples y transparentes
            </h2>
            <p className="text-lg text-surface-500 max-w-2xl mx-auto">
              Empieza gratis. Escala cuando lo necesites.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-surface-100 border border-surface-200 rounded-2xl p-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Empieza a crear contenido hoy
          </h2>
          <p className="text-lg text-surface-500 mb-8">
            Únete a miles de emprendedores que ya usan Onyx Labs para hacer crecer su negocio.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-black font-semibold px-8 py-3.5 rounded-lg transition-colors text-base"
          >
            Crear cuenta gratis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center">
              <span className="text-black font-bold text-xs">O</span>
            </div>
            <span className="text-sm font-bold text-white">Onyx Labs</span>
          </div>
          <p className="text-sm text-surface-500">&copy; {new Date().getFullYear()} Onyx Labs. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
