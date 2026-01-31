import React from 'react';
import { useInView } from 'react-intersection-observer';
import {
  Shield,
  Target,
  Rocket,
  Users,
  Lightbulb,
  HeartHandshake,
} from 'lucide-react';

interface Principle {
  icon: React.ElementType;
  title: string;
  description: string;
  number: string;
}

const principles: Principle[] = [
  {
    icon: Target,
    title: 'Results First',
    description:
      "We don't get paid for complexity. We get paid for outcomes. Every solution we build is measured by the impact it creates for your bottom line.",
    number: '01',
  },
  {
    icon: Shield,
    title: 'No Black Boxes',
    description:
      "You'll understand exactly how your AI works, why it makes decisions, and how to optimize it. We believe in empowering, not mystifying.",
    number: '02',
  },
  {
    icon: Rocket,
    title: 'Speed to Value',
    description:
      'Big tech moves slow. We move fast. Most projects launch within weeks, not months. You start seeing ROI before the first invoice lands.',
    number: '03',
  },
  {
    icon: Users,
    title: 'Built for Small Business',
    description:
      "We're not enterprise consultants moonlighting with SMBs. Small business is our specialty. Every solution is designed for your scale and budget.",
    number: '04',
  },
  {
    icon: Lightbulb,
    title: 'Practical Innovation',
    description:
      "We use cutting-edge AI, but only when it makes sense. No buzzwords, no hype—just proven technology applied to real business problems.",
    number: '05',
  },
  {
    icon: HeartHandshake,
    title: 'Partnership Mindset',
    description:
      "We succeed when you succeed. That's why we offer ongoing support, optimization, and training—not just a handoff and a goodbye.",
    number: '06',
  },
];

export const Principles: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="principles" className="relative py-32 bg-onyx-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="orb orb-pink w-[500px] h-[500px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block text-sm font-sans text-etheria-pink tracking-widest uppercase mb-4">
            Our Principles
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-50 mb-6">
            How We
            <span className="gradient-text"> Work</span>
          </h2>
          <p className="font-sans text-lg text-neutral-400 max-w-2xl mx-auto">
            We're not your typical consultants. Here's what sets us apart
            and why small businesses trust us with their AI transformation.
          </p>
        </div>

        {/* Principles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {principles.map((principle, idx) => {
            const Icon = principle.icon;
            return (
              <div
                key={idx}
                className={`group relative glass-light rounded-2xl p-8 card-hover transition-all duration-500 ${
                  inView
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Number badge */}
                <span className="absolute top-6 right-6 font-display text-4xl font-bold text-onyx-700 group-hover:text-etheria-purple/30 transition-colors">
                  {principle.number}
                </span>

                {/* Icon */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-etheria-purple/20 to-etheria-cyan/20 w-fit mb-6 group-hover:from-etheria-purple/30 group-hover:to-etheria-cyan/30 transition-all">
                  <Icon className="w-6 h-6 text-etheria-purple" />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-neutral-50 mb-3 group-hover:text-etheria-purple transition-colors">
                  {principle.title}
                </h3>
                <p className="font-sans text-neutral-400 leading-relaxed">
                  {principle.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Quote Section */}
        <div
          className={`mt-20 text-center transition-all duration-1000 delay-500 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <blockquote className="relative">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-8xl text-etheria-purple/20 font-serif">
              "
            </div>
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-neutral-200 italic max-w-4xl mx-auto leading-relaxed">
              Small businesses deserve the same AI advantages that Fortune 500 companies enjoy.
              <span className="gradient-text not-italic font-semibold"> We make that possible.</span>
            </p>
          </blockquote>
        </div>
      </div>
    </section>
  );
};

export default Principles;
