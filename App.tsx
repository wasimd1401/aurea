import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Manifesto from './components/Principles';
import Services from './components/Services';
import Process from './components/Process';
import Pricing from './components/Testimonials';
import Contact from './components/Contact';
import { Menu, X } from 'lucide-react';

const navItems = [
  { label: 'Servicios', href: '#servicios' },
  { label: 'Nosotros', href: '#manifiesto' },
  { label: 'Precios', href: '#precios' },
  { label: 'Contacto', href: '#contacto' },
];

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans antialiased bg-cream-50 text-onyx-950 overflow-x-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-cream-50/90 backdrop-blur-md py-4 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <a
            href="#inicio"
            onClick={scrollToTop}
            className="relative z-50 flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-onyx-950 flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="font-bold text-xl tracking-tight">
              ONYX<span className="gradient-text-fun">LABS</span>
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-6">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm font-medium text-onyx-700 hover:text-onyx-950 transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#contacto"
              className="btn-gradient px-6 py-2.5 rounded-full text-sm font-semibold text-white"
            >
              Empezar
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Overlay */}
        <div
          className={`fixed inset-0 bg-cream-50 z-40 flex flex-col items-center justify-center gap-8 transition-all duration-300 ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-3xl font-bold text-onyx-950 hover:text-pop-magenta transition-colors"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contacto"
            onClick={() => setIsMenuOpen(false)}
            className="mt-8 btn-gradient px-8 py-4 rounded-full text-lg font-semibold text-white"
          >
            Empezar
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Hero />
        <Manifesto />
        <Services />
        <Process />
        <Pricing />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="bg-onyx-950 text-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                  <span className="text-onyx-950 font-bold text-lg">O</span>
                </div>
                <span className="font-bold text-xl tracking-tight">
                  ONYX<span className="gradient-text-fun">LABS</span>
                </span>
              </div>
              <p className="text-gray-400 max-w-sm mb-4">
                La nueva era de colaboración humano + IA.
                Construimos el futuro para que puedas vivirlo.
              </p>
              <p className="text-sm text-gray-500">
                Hecho para humanos.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <h4 className="font-bold mb-4 text-sm tracking-widest text-gray-400">NAVEGACIÓN</h4>
              <ul className="space-y-3">
                <li><a href="#servicios" className="text-gray-300 hover:text-white transition-colors">Servicios</a></li>
                <li><a href="#manifiesto" className="text-gray-300 hover:text-white transition-colors">Nosotros</a></li>
                <li><a href="#precios" className="text-gray-300 hover:text-white transition-colors">Precios</a></li>
                <li><a href="#contacto" className="text-gray-300 hover:text-white transition-colors">Contacto</a></li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className="font-bold mb-4 text-sm tracking-widest text-gray-400">CONECTA</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Twitter/X</a></li>
                <li><a href="mailto:hola@onyxlabs.ai" className="text-gray-300 hover:text-white transition-colors">hola@onyxlabs.ai</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} ONYXLABS. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacidad</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Términos</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
