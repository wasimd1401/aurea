import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, CheckCircle } from 'lucide-react';

export const Contact: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
    }
  };

  return (
    <section id="contacto" className="relative py-24 md:py-32 bg-cream-100 overflow-hidden">
      {/* Decorative spheres */}
      <div className="sphere sphere-gradient-1 w-32 h-32 -top-10 -left-10 animate-float opacity-50" />
      <div className="sphere sphere-gradient-2 w-24 h-24 top-20 right-10 animate-float-delayed opacity-40" />
      <div className="sphere sphere-gradient-3 w-20 h-20 bottom-10 left-1/4 animate-float opacity-30" />

      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Headline */}
        <div
          className={`mb-10 transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
            ¿LISTO PARA
          </h2>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4">
            <span className="accent-italic gradient-text-fun">RECUPERAR</span>
          </h2>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
            TU TIEMPO?
          </h2>
        </div>

        <p
          className={`text-onyx-700 text-lg mb-10 transition-all duration-700 delay-200 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          Simplifiquemos tus operaciones hoy.
        </p>

        {/* Form */}
        <div
          className={`transition-all duration-700 delay-400 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          {isSubmitted ? (
            <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-pop-cyan/10 border border-pop-cyan">
              <CheckCircle className="w-6 h-6 text-pop-cyan" />
              <span className="font-semibold text-pop-cyan">¡Perfecto! Te contactamos pronto.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="flex-1 px-6 py-4 rounded-full border-2 border-onyx-950/10 bg-white focus:outline-none focus:border-pop-cyan transition-colors text-center sm:text-left"
              />
              <button
                type="submit"
                className="btn-dark px-8 py-4 rounded-full font-semibold flex items-center justify-center gap-2"
              >
                <span>Hablemos</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
