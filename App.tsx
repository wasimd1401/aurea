import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import CreativeGenerator from './components/LeadMagnet';
import Contact from './components/Contact';
import { CONTENT } from './constants';
import { Language } from './types';
import { Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('es');
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
    <div className="font-sans antialiased selection:bg-austral-clay selection:text-white bg-white">
      
      {/* Sticky Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-white/95 backdrop-blur-md py-4 shadow-sm border-b border-gray-100' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          
          <a href="#" onClick={scrollToTop} className="text-2xl font-serif font-bold tracking-tighter text-austral-dark z-50 relative">
            AUREA
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            <ul className="flex gap-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="text-xs uppercase tracking-widest hover:text-austral-clay transition-colors text-gray-800 font-bold">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            
            {/* Language Pill */}
            <button 
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')} 
              className="text-[10px] font-bold w-12 h-6 flex items-center justify-center rounded-full bg-gray-100 text-austral-dark hover:bg-austral-dark hover:text-white transition-all tracking-wider"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden z-50 text-austral-dark" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Overlay */}
        <div className={`fixed inset-0 bg-white z-40 flex flex-col items-center justify-center gap-10 transition-transform duration-500 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
           {navItems.map((item) => (
                <a 
                  key={item.label} 
                  href={item.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-serif italic text-austral-dark hover:text-austral-clay"
                >
                  {item.label}
                </a>
              ))}
           <button 
              onClick={() => { setLang(lang === 'es' ? 'en' : 'es'); setIsMenuOpen(false); }} 
              className="mt-8 text-sm font-bold border border-austral-dark px-8 py-3 rounded-full text-austral-dark uppercase tracking-widest"
            >
              {lang === 'es' ? 'English' : 'Español'}
            </button>
        </div>
      </nav>

      <main>
        <Hero lang={lang} />
        <Services lang={lang} />
        <CreativeGenerator lang={lang} />
        <Contact lang={lang} />
      </main>

      <footer className="bg-white text-austral-dark py-16 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-serif font-bold text-2xl tracking-tighter">AUREA</p>
          <div className="text-xs text-gray-400 font-medium tracking-wide text-center md:text-right">
             <p className="mb-2">Inteligencia Estratégica</p>
             <p>&copy; {new Date().getFullYear()} Santiago, Chile</p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;