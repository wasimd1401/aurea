import React from 'react';
import { ArrowRight, Sparkles, Zap, TrendingUp } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-onyx-950">
        {/* Animated gradient orbs */}
        <div className="orb orb-purple w-[600px] h-[600px] -top-40 -left-40" />
        <div className="orb orb-cyan w-[500px] h-[500px] top-1/2 -right-20" />
        <div className="orb orb-pink w-[400px] h-[400px] -bottom-20 left-1/3" />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 grid-pattern opacity-50" />

        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-onyx-950/50 to-onyx-950" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8 animate-float">
          <Sparkles className="w-4 h-4 text-etheria-purple" />
          <span className="text-sm font-sans text-neutral-300">AI Consulting for the Bold</span>
        </div>

        {/* Main Headline */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6">
          <span className="text-neutral-50">Give Your Business</span>
          <br />
          <span className="shimmer-text">The Unfair Advantage</span>
        </h1>

        {/* Subheadline */}
        <p className="font-sans text-lg md:text-xl text-neutral-400 max-w-3xl mx-auto mb-10 leading-relaxed">
          Enterprise-grade AI solutions, tailored for small businesses.
          We transform complex AI technology into competitive weapons that
          multiply your team's output and slash operational costs.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <a
            href="#contact"
            className="group btn-gradient px-8 py-4 rounded-full font-display font-semibold text-white flex items-center gap-3"
          >
            Start Your Transformation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#services"
            className="px-8 py-4 rounded-full font-display font-medium text-neutral-300 border border-neutral-700 hover:border-etheria-purple hover:text-white transition-all"
          >
            Explore Services
          </a>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-12 border-t border-neutral-800">
          <div className="text-center group">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-etheria-cyan" />
              <span className="font-display text-4xl font-bold gradient-text">10x</span>
            </div>
            <p className="font-sans text-sm text-neutral-500">Average Productivity Boost</p>
          </div>
          <div className="text-center group">
            <div className="flex items-center justify-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-etheria-purple" />
              <span className="font-display text-4xl font-bold gradient-text">60%</span>
            </div>
            <p className="font-sans text-sm text-neutral-500">Cost Reduction</p>
          </div>
          <div className="text-center group">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-etheria-pink" />
              <span className="font-display text-4xl font-bold gradient-text">500+</span>
            </div>
            <p className="font-sans text-sm text-neutral-500">Small Businesses Transformed</p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="text-xs text-neutral-500 font-sans tracking-widest uppercase">Scroll</span>
        <div className="w-6 h-10 rounded-full border-2 border-neutral-700 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-etheria-purple rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
