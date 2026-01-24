import React, { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import Outcomes from './components/Outcomes';
import Process from './components/Process';
import About from './components/About';
import Faqs from './components/Faqs';
import Contact from './components/Contact';
import Privacy from './components/Privacy';
import { CONTENT } from './constants';
import { Language } from './types';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [lang] = useState<Language>('en');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = CONTENT[lang].nav;

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans antialiased selection:bg-austral-clay selection:text-white bg-austral-dark text-white">
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-austral-dark/95 backdrop-blur-md py-4 shadow-lg shadow-black/30' : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <a href="#" onClick={scrollToTop} className="text-2xl font-serif font-bold tracking-tighter text-white z-50 relative">
            ONYX AI Consulting
          </a>

          <div className="hidden md:flex items-center gap-10">
            <ul className="flex gap-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-xs uppercase tracking-widest hover:text-austral-gold transition-colors text-gray-200 font-semibold">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <button className="md:hidden z-50 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <div
          className={`fixed inset-0 bg-austral-dark z-40 flex flex-col items-center justify-center gap-10 transition-transform duration-500 ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-3xl font-serif italic text-white hover:text-austral-gold"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <main>
        <Hero lang={lang} />
        <Services lang={lang} />
        <Outcomes lang={lang} />
        <Process lang={lang} />
        <About lang={lang} />
        <Faqs lang={lang} />
        <Contact lang={lang} />
        <Privacy lang={lang} />
      </main>

      <footer className="bg-austral-dark text-gray-300 py-16 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-serif font-bold text-2xl tracking-tighter text-white">ONYX AI Consulting</p>
          <div className="text-xs text-gray-400 font-medium tracking-wide text-center md:text-right">
            <p className="mb-2">{CONTENT[lang].footer.tagline}</p>
            <p>{CONTENT[lang].footer.note}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
