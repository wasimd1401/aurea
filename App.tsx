import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import Services from './components/Services';
import Principles from './components/Principles';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import { Menu, X, ArrowUp } from 'lucide-react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Principles', href: '#principles' },
  { label: 'Success Stories', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
];

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="font-sans antialiased bg-onyx-950 text-neutral-50 overflow-x-hidden">
      {/* Sticky Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo */}
          <a
            href="#home"
            onClick={scrollToTop}
            className="relative z-50 flex items-center gap-2"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-etheria-purple to-etheria-cyan flex items-center justify-center">
              <span className="text-white font-display font-bold text-lg">O</span>
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-neutral-50">
              ONYXLABS
            </span>
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex gap-6">
              {navItems.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm font-sans text-neutral-400 hover:text-neutral-50 transition-colors underline-animate"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="#contact"
              className="btn-gradient px-6 py-2.5 rounded-full text-sm font-display font-semibold text-white"
            >
              Get Started
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden z-50 text-neutral-50 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Overlay */}
        <div
          className={`fixed inset-0 bg-onyx-950/98 backdrop-blur-xl z-40 flex flex-col items-center justify-center gap-8 transition-all duration-500 ${
            isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          {navItems.map((item, idx) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="text-3xl font-display font-semibold text-neutral-50 hover:text-etheria-purple transition-colors"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {item.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
            className="mt-8 btn-gradient px-8 py-4 rounded-full text-lg font-display font-semibold text-white"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <Hero />
        <Services />
        <Principles />
        <Testimonials />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="relative bg-onyx-900 py-20 px-6 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto">
          {/* Top Footer */}
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-etheria-purple to-etheria-cyan flex items-center justify-center">
                  <span className="text-white font-display font-bold text-lg">O</span>
                </div>
                <span className="font-display text-xl font-bold tracking-tight text-neutral-50">
                  ONYXLABS
                </span>
              </div>
              <p className="font-sans text-neutral-400 max-w-md mb-6">
                Giving small businesses the unfair advantage through strategic AI implementation.
                Enterprise-grade solutions, tailored for your scale and budget.
              </p>
              <p className="font-serif text-lg italic text-etheria-purple">
                "AI for the ambitious."
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold text-neutral-50 mb-4">Quick Links</h4>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="font-sans text-neutral-400 hover:text-neutral-50 transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-semibold text-neutral-50 mb-4">Get In Touch</h4>
              <ul className="space-y-3 font-sans text-neutral-400">
                <li>
                  <a href="mailto:hello@onyxlabs.ai" className="hover:text-neutral-50 transition-colors">
                    hello@onyxlabs.ai
                  </a>
                </li>
                <li>
                  <a href="tel:+1-555-ONYX-LAB" className="hover:text-neutral-50 transition-colors">
                    +1 (555) ONYX-LAB
                  </a>
                </li>
                <li>San Francisco, CA</li>
              </ul>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-500">
              &copy; {new Date().getFullYear()} ONYXLABS. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <a href="#" className="hover:text-neutral-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-neutral-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-4 rounded-full bg-gradient-to-br from-etheria-purple to-etheria-cyan text-white shadow-lg transition-all duration-300 hover:scale-110 z-40 ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
    </div>
  );
};

export default App;
