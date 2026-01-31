import React from 'react';
import { useInView } from 'react-intersection-observer';
import { Star, Quote, ArrowRight } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  result: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "ONYXLABS automated our entire customer onboarding process. What used to take our team 3 hours per client now takes 15 minutes. It's like we hired 10 people overnight.",
    author: 'Sarah Chen',
    role: 'CEO',
    company: 'Bloom Marketing Co.',
    result: '12x faster onboarding',
    avatar: 'SC',
  },
  {
    quote:
      "We were skeptical about AI—it felt like something only big tech could afford. ONYXLABS proved us wrong. The chatbot they built handles 80% of our support tickets automatically.",
    author: 'Marcus Johnson',
    role: 'Founder',
    company: 'TechFix Solutions',
    result: '80% ticket automation',
    avatar: 'MJ',
  },
  {
    quote:
      "Their predictive analytics gave us visibility we never had. We now forecast demand three months out and have cut inventory costs by 40%. Game changer.",
    author: 'Elena Rodriguez',
    role: 'Operations Director',
    company: 'Verde Supply Co.',
    result: '40% cost reduction',
    avatar: 'ER',
  },
];

const stats = [
  { value: '500+', label: 'Small Businesses Served' },
  { value: '$12M+', label: 'Client Savings Generated' },
  { value: '98%', label: 'Client Retention Rate' },
  { value: '4.9', label: 'Average Rating', hasStar: true },
];

export const Testimonials: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="testimonials" className="relative py-32 bg-onyx-800 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="orb orb-cyan w-[400px] h-[400px] -top-20 right-0 opacity-15" />
        <div className="orb orb-purple w-[300px] h-[300px] bottom-20 -left-20 opacity-15" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block text-sm font-sans text-etheria-cyan tracking-widest uppercase mb-4">
            Success Stories
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-50 mb-6">
            Real Results From
            <span className="gradient-text"> Real Businesses</span>
          </h2>
          <p className="font-sans text-lg text-neutral-400 max-w-2xl mx-auto">
            Don't just take our word for it. Here's what small business owners
            say about working with ONYXLABS.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid lg:grid-cols-3 gap-6 mb-20">
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className={`glass rounded-2xl p-8 flex flex-col card-hover transition-all duration-500 ${
                inView
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Quote icon */}
              <Quote className="w-10 h-10 text-etheria-purple/30 mb-6" />

              {/* Quote text */}
              <p className="font-sans text-neutral-300 leading-relaxed mb-8 flex-grow">
                "{testimonial.quote}"
              </p>

              {/* Result badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-etheria-purple/10 border border-etheria-purple/20 w-fit mb-6">
                <span className="text-sm font-display font-semibold text-etheria-purple">
                  {testimonial.result}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-neutral-700">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-etheria-purple to-etheria-cyan flex items-center justify-center">
                  <span className="font-display font-bold text-white text-sm">
                    {testimonial.avatar}
                  </span>
                </div>
                <div>
                  <p className="font-display font-semibold text-neutral-50">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {testimonial.role}, {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div
          ref={statsRef}
          className={`glass rounded-3xl p-8 md:p-12 transition-all duration-1000 ${
            statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="text-center"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="font-display text-4xl md:text-5xl font-bold gradient-text">
                    {stat.value}
                  </span>
                  {stat.hasStar && (
                    <Star className="w-6 h-6 text-accent-gold fill-accent-gold" />
                  )}
                </div>
                <p className="font-sans text-sm text-neutral-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-16 transition-all duration-1000 delay-300 ${
            statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <p className="font-sans text-neutral-400 mb-6">
            Ready to become our next success story?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 btn-gradient px-8 py-4 rounded-full font-display font-semibold text-white"
          >
            Start Your Transformation
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
