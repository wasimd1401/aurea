import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  Bot,
  Workflow,
  Brain,
  BarChart3,
  MessageSquare,
  FileSearch,
  ArrowRight,
  Check,
} from 'lucide-react';

interface Service {
  icon: React.ElementType;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  gradient: string;
}

const services: Service[] = [
  {
    icon: Bot,
    title: 'AI Automation',
    tagline: 'Work smarter, not harder',
    description:
      'Eliminate repetitive tasks that drain your team. We build custom AI workflows that handle data entry, reporting, scheduling, and more—so your team focuses on what matters.',
    features: [
      'Custom workflow automation',
      'Intelligent data processing',
      'Smart scheduling systems',
      'Automated reporting & alerts',
    ],
    gradient: 'from-etheria-purple to-etheria-blue',
  },
  {
    icon: MessageSquare,
    title: 'AI Assistants & Chatbots',
    tagline: '24/7 customer support',
    description:
      'Deploy intelligent conversational AI that understands your business. Handle customer inquiries, qualify leads, and provide support around the clock—without growing your team.',
    features: [
      'Custom-trained on your data',
      'Multi-channel deployment',
      'Lead qualification & routing',
      'Seamless CRM integration',
    ],
    gradient: 'from-etheria-cyan to-accent-emerald',
  },
  {
    icon: Brain,
    title: 'AI Strategy Consulting',
    tagline: 'Your AI roadmap',
    description:
      'Not sure where to start? We analyze your operations, identify high-impact AI opportunities, and create a practical implementation roadmap tailored to your budget and goals.',
    features: [
      'Operations audit & analysis',
      'ROI-focused opportunity mapping',
      'Technology stack recommendations',
      'Implementation timeline & milestones',
    ],
    gradient: 'from-etheria-pink to-etheria-purple',
  },
  {
    icon: BarChart3,
    title: 'Predictive Analytics',
    tagline: 'See the future of your business',
    description:
      'Turn your data into foresight. Our AI models predict customer behavior, inventory needs, revenue trends, and market shifts—giving you the intelligence to act before competitors react.',
    features: [
      'Demand forecasting',
      'Customer churn prediction',
      'Revenue trend analysis',
      'Inventory optimization',
    ],
    gradient: 'from-accent-gold to-accent-amber',
  },
  {
    icon: FileSearch,
    title: 'Document Intelligence',
    tagline: 'Unlock your data',
    description:
      'Extract insights from contracts, invoices, reports, and emails automatically. Our document AI reads, understands, and organizes your unstructured data into actionable intelligence.',
    features: [
      'Intelligent document parsing',
      'Contract analysis & extraction',
      'Automated data entry',
      'Knowledge base creation',
    ],
    gradient: 'from-etheria-blue to-etheria-cyan',
  },
  {
    icon: Workflow,
    title: 'Custom AI Solutions',
    tagline: 'Built for your needs',
    description:
      "Have a unique challenge? We design and build custom AI solutions from the ground up. From proprietary algorithms to specialized integrations—if you can imagine it, we can build it.",
    features: [
      'Bespoke AI development',
      'API & system integration',
      'Scalable architecture',
      'Ongoing optimization & support',
    ],
    gradient: 'from-etheria-violet to-etheria-pink',
  },
];

export const Services: React.FC = () => {
  const [activeService, setActiveService] = useState(0);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const ActiveIcon = services[activeService].icon;

  return (
    <section id="services" className="relative py-32 bg-onyx-900 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="orb orb-purple w-[400px] h-[400px] top-20 -right-40 opacity-20" />
        <div className="orb orb-cyan w-[300px] h-[300px] bottom-40 -left-20 opacity-20" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div
          className={`text-center mb-20 transition-all duration-1000 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block text-sm font-sans text-etheria-purple tracking-widest uppercase mb-4">
            Our Services
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-50 mb-6">
            AI Solutions That
            <span className="gradient-text"> Drive Results</span>
          </h2>
          <p className="font-sans text-lg text-neutral-400 max-w-2xl mx-auto">
            From automation to analytics, we deliver enterprise-grade AI capabilities
            designed specifically for small business budgets and needs.
          </p>
        </div>

        {/* Desktop: Interactive Cards */}
        <div className="hidden lg:grid grid-cols-12 gap-8">
          {/* Service List */}
          <div className="col-span-5 space-y-3">
            {services.map((service, idx) => {
              const Icon = service.icon;
              const isActive = activeService === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveService(idx)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 group ${
                    isActive
                      ? 'glass etheria-glow'
                      : 'hover:bg-onyx-800/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-xl transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-br ${service.gradient}`
                          : 'bg-onyx-700 group-hover:bg-onyx-600'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? 'text-white' : 'text-neutral-400'
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`font-display font-semibold text-lg transition-colors ${
                          isActive ? 'text-neutral-50' : 'text-neutral-300 group-hover:text-neutral-50'
                        }`}
                      >
                        {service.title}
                      </h3>
                      <p className="text-sm text-neutral-500">{service.tagline}</p>
                    </div>
                    <ArrowRight
                      className={`w-5 h-5 ml-auto transition-all ${
                        isActive
                          ? 'text-etheria-purple opacity-100 translate-x-0'
                          : 'opacity-0 -translate-x-2'
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Service Detail */}
          <div className="col-span-7">
            <div
              key={activeService}
              className="glass rounded-3xl p-10 h-full flex flex-col justify-center animate-fade-in"
            >
              <div
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${services[activeService].gradient} mb-6 w-fit`}
              >
                <ActiveIcon className="w-8 h-8 text-white" />
              </div>

              <h3 className="font-display text-3xl font-bold text-neutral-50 mb-2">
                {services[activeService].title}
              </h3>
              <p className="text-etheria-cyan font-sans text-sm uppercase tracking-wider mb-6">
                {services[activeService].tagline}
              </p>

              <p className="font-sans text-lg text-neutral-300 leading-relaxed mb-8">
                {services[activeService].description}
              </p>

              <div className="space-y-3 mb-8">
                {services[activeService].features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-etheria-purple/20">
                      <Check className="w-4 h-4 text-etheria-purple" />
                    </div>
                    <span className="font-sans text-neutral-300">{feature}</span>
                  </div>
                ))}
              </div>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-etheria-purple font-display font-semibold hover:gap-3 transition-all"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Mobile: Stacked Cards */}
        <div className="lg:hidden grid gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="glass rounded-2xl p-6 card-hover"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${service.gradient}`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-lg text-neutral-50">
                      {service.title}
                    </h3>
                    <p className="text-sm text-etheria-cyan">{service.tagline}</p>
                  </div>
                </div>
                <p className="font-sans text-neutral-400 text-sm leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="space-y-2">
                  {service.features.slice(0, 2).map((feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-etheria-purple" />
                      <span className="text-neutral-400">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="font-sans text-neutral-400 mb-6">
            Not sure which service is right for you?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-3 btn-gradient px-8 py-4 rounded-full font-display font-semibold text-white"
          >
            Book a Free Strategy Call
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
