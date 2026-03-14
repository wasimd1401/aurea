import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Play, Pen, Wand2, Rocket, Menu, X } from 'lucide-react';
import { PRICING_TIERS } from '../constants';

// Scroll-reveal hook
const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-in');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
};

const RevealSection: React.FC<{ children: React.ReactNode; className?: string; delay?: string }> = ({ children, className = '', delay = '' }) => {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-8 transition-all duration-700 ease-out ${delay} ${className}`}
      style={{ transitionDelay: delay }}
    >
      {children}
    </div>
  );
};

const Landing: React.FC = () => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  // Add animation styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .animate-in { opacity: 1 !important; transform: translateY(0) !important; }
      .stagger-1 { transition-delay: 100ms; }
      .stagger-2 { transition-delay: 200ms; }
      .stagger-3 { transition-delay: 300ms; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

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
            <a href="#problema" className="text-sm text-surface-600 hover:text-white transition-colors">El problema</a>
            <a href="#features" className="text-sm text-surface-600 hover:text-white transition-colors">Herramientas</a>
            <a href="#pricing" className="text-sm text-surface-600 hover:text-white transition-colors">Precios</a>
            <Link to="/login" className="text-sm text-surface-600 hover:text-white transition-colors">Iniciar sesión</Link>
            <Link to="/signup" className="bg-accent hover:bg-accent-light text-black text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
              Empezar gratis
            </Link>
          </div>

          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-surface-100 border-b border-surface-200 px-6 py-4 space-y-3">
            <a href="#problema" onClick={() => setMenuOpen(false)} className="block text-sm text-surface-600 hover:text-white">El problema</a>
            <a href="#features" onClick={() => setMenuOpen(false)} className="block text-sm text-surface-600 hover:text-white">Herramientas</a>
            <a href="#pricing" onClick={() => setMenuOpen(false)} className="block text-sm text-surface-600 hover:text-white">Precios</a>
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block text-sm text-surface-600 hover:text-white">Iniciar sesión</Link>
            <Link to="/signup" onClick={() => setMenuOpen(false)} className="block bg-accent text-black text-sm font-semibold px-4 py-2 rounded-lg text-center">
              Empezar gratis
            </Link>
          </div>
        )}
      </nav>

      {/* Launch Banner */}
      <div className="fixed top-16 left-0 right-0 z-40 bg-gradient-to-r from-accent-dark via-accent to-accent-dark">
        <div className="max-w-7xl mx-auto px-6 py-2.5 text-center">
          <p className="text-sm font-semibold text-black">
            🚀 LANZAMIENTO OFICIAL — Sé de los primeros. Precio de fundador bloqueado de por vida.
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="pt-44 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <RevealSection>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight mb-6">
              Tu competencia no sabe
              <br />
              <span className="text-accent">cómo lo haces.</span>
            </h1>
          </RevealSection>

          <RevealSection delay="150ms">
            <p className="text-lg sm:text-xl text-surface-500 max-w-2xl mx-auto mb-10 leading-relaxed">
              Contenido para 5 redes + diseños que destacan — tu semana lista en dos minutos.
            </p>
          </RevealSection>

          <RevealSection delay="300ms">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Link
                to="/signup"
                className="w-full sm:w-auto bg-accent hover:bg-accent-light text-black font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-accent/20 flex items-center justify-center gap-2 text-base"
              >
                Empezar gratis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#como-funciona"
                className="w-full sm:w-auto border border-surface-300 hover:border-surface-400 text-white font-medium px-8 py-4 rounded-xl transition-colors text-center text-base flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                Ver demo
              </a>
            </div>
          </RevealSection>

          <RevealSection delay="450ms">
            <p className="text-sm text-surface-400">
              Sin tarjeta de crédito &bull; 100% en español &bull; Cancela cuando quieras
            </p>
          </RevealSection>
        </div>
      </section>

      {/* Problem Section */}
      <section id="problema" className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <RevealSection>
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                Crear contenido no debería sentirse como un <span className="text-accent">segundo trabajo.</span>
              </h2>
            </div>
          </RevealSection>

          <div className="space-y-5">
            {[
              'Horas frente a la pantalla en blanco',
              'Copiar y pegar entre 5 apps diferentes',
              'Pagar diseñadores para cada post',
              'Publicar inconsistentemente porque "no hay tiempo"',
            ].map((pain, i) => (
              <RevealSection key={pain} delay={`${i * 100}ms`}>
                <div className="flex items-center gap-4 bg-surface-100 border border-surface-200 rounded-xl px-6 py-5 hover:border-red-500/20 transition-colors">
                  <span className="text-xl flex-shrink-0">❌</span>
                  <p className="text-base sm:text-lg text-surface-700 font-medium">{pain}</p>
                </div>
              </RevealSection>
            ))}
          </div>

          <RevealSection delay="400ms">
            <div className="text-center mt-14">
              <p className="text-lg text-surface-500">
                <span className="text-accent font-semibold">Onyx Labs</span> elimina todo eso. En minutos, no en horas.
              </p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* Features — Two Cards */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Dos herramientas. Todo tu contenido.
              </h2>
              <p className="text-lg text-surface-500 max-w-2xl mx-auto">
                Deja de saltar entre aplicaciones. Todo lo que necesitas, en un solo lugar.
              </p>
            </div>
          </RevealSection>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Content Studio Card */}
            <RevealSection delay="100ms">
              <div className="bg-surface-100 border border-surface-200 rounded-2xl p-8 sm:p-10 hover:border-accent/30 transition-all group h-full">
                <div className="text-4xl mb-5">📝</div>
                <h3 className="text-2xl font-bold text-white mb-2">Content Studio</h3>
                <p className="text-accent font-medium mb-6">De idea a 5 plataformas en segundos.</p>
                <ul className="space-y-4">
                  {[
                    'Genera contenido para Instagram, TikTok, LinkedIn, X y Facebook a la vez',
                    'Hooks que capturan atención en los primeros 3 segundos',
                    'Hashtags y formatos optimizados por plataforma',
                    'Tu voz de marca integrada en cada texto',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-surface-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 text-accent hover:text-accent-light font-semibold text-sm mt-8 group-hover:gap-3 transition-all"
                >
                  Probar Content Studio
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </RevealSection>

            {/* Image Creator Card */}
            <RevealSection delay="250ms">
              <div className="bg-surface-100 border border-surface-200 rounded-2xl p-8 sm:p-10 hover:border-blue-500/30 transition-all group h-full">
                <div className="text-4xl mb-5">🎨</div>
                <h3 className="text-2xl font-bold text-white mb-2">Image Creator</h3>
                <p className="text-blue-400 font-medium mb-6">Diseños que paran el scroll. Sin saber diseñar.</p>
                <ul className="space-y-4">
                  {[
                    'Imágenes generadas con IA que se sienten hechas a medida',
                    'Estilos predefinidos: minimalista, bold, elegante, urbano y más',
                    'Tamaños optimizados para cada red social automáticamente',
                    'Paleta de colores de tu marca aplicada con un clic',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-surface-600 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm mt-8 group-hover:gap-3 transition-all"
                >
                  Probar Image Creator
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealSection>
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Así de fácil funciona
              </h2>
              <p className="text-lg text-surface-500">
                De cero a contenido publicado en tres pasos.
              </p>
            </div>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting line (desktop) */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-accent/0 via-accent/40 to-accent/0" />

            {[
              {
                step: '①',
                icon: Pen,
                title: 'Escribe tu idea',
                description: 'Describe tu tema, producto o mensaje en una línea. La IA se encarga del resto.',
                delay: '100ms',
              },
              {
                step: '②',
                icon: Wand2,
                title: 'Genera todo',
                description: 'Contenido para 5 redes + imágenes listas. Edita, ajusta o regenera lo que quieras.',
                delay: '250ms',
              },
              {
                step: '③',
                icon: Rocket,
                title: 'Publica y destaca',
                description: 'Descarga, copia o programa. Tu marca se ve profesional, consistente y activa.',
                delay: '400ms',
              },
            ].map(({ step, icon: Icon, title, description, delay }) => (
              <RevealSection key={title} delay={delay}>
                <div className="text-center relative">
                  <div className="w-16 h-16 bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10">
                    <Icon className="w-7 h-7 text-accent" />
                  </div>
                  <div className="text-xs font-bold text-accent uppercase tracking-widest mb-3">{step}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-sm text-surface-500 leading-relaxed max-w-xs mx-auto">{description}</p>
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <RevealSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                Precios simples y transparentes
              </h2>
              <p className="text-lg text-surface-500 max-w-2xl mx-auto">
                Empieza gratis. Escala cuando lo necesites.
              </p>
            </div>
          </RevealSection>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PRICING_TIERS.map((tier, i) => (
              <RevealSection key={tier.name} delay={`${i * 120}ms`}>
                <div
                  className={`rounded-2xl p-8 border transition-colors h-full ${
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
                    className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all mb-8 ${
                      tier.highlighted
                        ? 'bg-accent hover:bg-accent-light text-black hover:shadow-lg hover:shadow-accent/20'
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
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 px-6">
        <RevealSection>
          <div className="max-w-3xl mx-auto text-center bg-gradient-to-br from-surface-100 to-surface-50 border border-surface-200 rounded-3xl p-12 sm:p-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Tu contenido de la semana, listo en minutos.
            </h2>
            <p className="text-lg text-surface-500 mb-8 max-w-lg mx-auto">
              Únete a los emprendedores que ya usan Onyx Labs para destacar en cada red social.
            </p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-black font-semibold px-8 py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-accent/20 text-base"
            >
              Crear cuenta gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-xs text-surface-400 mt-4">
              Sin tarjeta de crédito &bull; Configuración en 2 minutos
            </p>
          </div>
        </RevealSection>
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
