import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  Send,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  company: string;
  employees: string;
  challenge: string;
  budget: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  company: '',
  employees: '',
  challenge: '',
  budget: '',
};

const benefits = [
  'Free 30-minute strategy session',
  'Custom AI opportunity assessment',
  'ROI projections for your business',
  'No obligation, no pressure',
];

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="relative py-32 bg-onyx-950 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="orb orb-purple w-[600px] h-[600px] -bottom-40 -right-40 opacity-20" />
        <div className="orb orb-cyan w-[400px] h-[400px] top-20 -left-20 opacity-15" />
        <div className="absolute inset-0 grid-pattern opacity-20" />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block text-sm font-sans text-etheria-purple tracking-widest uppercase mb-4">
            Get Started
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-50 mb-6">
            Ready for Your
            <span className="gradient-text"> Unfair Advantage?</span>
          </h2>
          <p className="font-sans text-lg text-neutral-400 max-w-2xl mx-auto">
            Book a free strategy call. We'll analyze your business, identify AI opportunities,
            and show you exactly how we can help—no strings attached.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left Column - Benefits & Info */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {/* Benefits Card */}
            <div className="glass rounded-3xl p-8 mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gradient-to-br from-etheria-purple to-etheria-cyan">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-bold text-neutral-50">
                    Free Strategy Call
                  </h3>
                  <p className="text-sm text-neutral-400">30 minutes that could change everything</p>
                </div>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-accent-emerald/20">
                      <CheckCircle className="w-4 h-4 text-accent-emerald" />
                    </div>
                    <span className="font-sans text-neutral-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-onyx-800">
                  <Mail className="w-5 h-5 text-etheria-purple" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Email us</p>
                  <a
                    href="mailto:hello@onyxlabs.ai"
                    className="font-display text-neutral-50 hover:text-etheria-purple transition-colors"
                  >
                    hello@onyxlabs.ai
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-onyx-800">
                  <Phone className="w-5 h-5 text-etheria-cyan" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Call us</p>
                  <a
                    href="tel:+1-555-ONYX-LAB"
                    className="font-display text-neutral-50 hover:text-etheria-cyan transition-colors"
                  >
                    +1 (555) ONYX-LAB
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-onyx-800">
                  <MapPin className="w-5 h-5 text-etheria-pink" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">Headquarters</p>
                  <p className="font-display text-neutral-50">
                    San Francisco, CA
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Badge */}
            <div className="mt-8 flex items-center gap-4 p-4 rounded-2xl bg-onyx-900/50 border border-neutral-800">
              <Sparkles className="w-8 h-8 text-accent-gold" />
              <div>
                <p className="font-display font-semibold text-neutral-50">
                  Trusted by 500+ Small Businesses
                </p>
                <p className="text-sm text-neutral-500">
                  Join the businesses already gaining their unfair advantage
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            {isSubmitted ? (
              <div className="glass rounded-3xl p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-emerald to-etheria-cyan flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-display text-2xl font-bold text-neutral-50 mb-4">
                  You're All Set!
                </h3>
                <p className="font-sans text-neutral-400 mb-8">
                  Thanks for reaching out! We'll review your information and get back to you
                  within 24 hours to schedule your free strategy call.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData(initialFormData);
                  }}
                  className="text-etheria-purple font-display font-semibold hover:underline"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="glass rounded-3xl p-8 md:p-10 space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-sans text-neutral-400 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-onyx-800 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-50 font-sans placeholder:text-neutral-600 focus:outline-none focus:border-etheria-purple transition-colors"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-sans text-neutral-400 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-onyx-800 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-50 font-sans placeholder:text-neutral-600 focus:outline-none focus:border-etheria-purple transition-colors"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-sans text-neutral-400 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="company"
                      required
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full bg-onyx-800 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-50 font-sans placeholder:text-neutral-600 focus:outline-none focus:border-etheria-purple transition-colors"
                      placeholder="Acme Inc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-sans text-neutral-400 mb-2">
                      Team Size
                    </label>
                    <select
                      name="employees"
                      value={formData.employees}
                      onChange={handleChange}
                      className="w-full bg-onyx-800 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-50 font-sans focus:outline-none focus:border-etheria-purple transition-colors"
                    >
                      <option value="">Select...</option>
                      <option value="1-5">1-5 employees</option>
                      <option value="6-20">6-20 employees</option>
                      <option value="21-50">21-50 employees</option>
                      <option value="51-100">51-100 employees</option>
                      <option value="100+">100+ employees</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-sans text-neutral-400 mb-2">
                    What's your biggest challenge? *
                  </label>
                  <textarea
                    name="challenge"
                    required
                    value={formData.challenge}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-onyx-800 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-50 font-sans placeholder:text-neutral-600 focus:outline-none focus:border-etheria-purple transition-colors resize-none"
                    placeholder="Tell us about a bottleneck, repetitive task, or area where you'd like AI to help..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-sans text-neutral-400 mb-2">
                    Monthly Budget for AI
                  </label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full bg-onyx-800 border border-neutral-700 rounded-xl px-4 py-3 text-neutral-50 font-sans focus:outline-none focus:border-etheria-purple transition-colors"
                  >
                    <option value="">Select...</option>
                    <option value="under-1k">Under $1,000/mo</option>
                    <option value="1k-5k">$1,000 - $5,000/mo</option>
                    <option value="5k-10k">$5,000 - $10,000/mo</option>
                    <option value="10k+">$10,000+/mo</option>
                    <option value="not-sure">Not sure yet</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full btn-gradient py-4 rounded-xl font-display font-semibold text-white flex items-center justify-center gap-3"
                >
                  Book Your Free Strategy Call
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-center text-sm text-neutral-500">
                  No spam, no obligations. Just a conversation about your potential.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
