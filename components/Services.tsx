import React, { useState } from 'react';
import { CONTENT } from '../constants';
import { Language } from '../types';
import { BrainCircuit, PenTool, BarChart2, Target, Plus, Minus, ArrowUpRight, Cpu, Layout } from 'lucide-react';

interface ServicesProps {
  lang: Language;
}

const Services: React.FC<ServicesProps> = ({ lang }) => {
  const content = CONTENT[lang].services;
  // Specific icon set where the first one (Automation) uses a CPU/Chip icon
  const icons = [Cpu, PenTool, BarChart2, Target, Layout];
  const [activeService, setActiveService] = useState<number>(0);

  return (
    <section id="services" className="min-h-screen bg-white text-austral-dark relative flex flex-col pt-32 pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full flex-grow flex flex-col">
        
        <div className="mb-20 border-t border-gray-200 pt-12 flex flex-col md:flex-row justify-between items-start md:items-end">
          <h2 className="text-5xl md:text-6xl font-serif text-austral-dark max-w-xl leading-none tracking-tight">
            {content.title}
          </h2>
          <p className="mt-6 md:mt-0 text-gray-600 max-w-xs text-sm uppercase tracking-wider font-medium">
             {content.subtitle}
          </p>
        </div>

        {/* Desktop Split Layout */}
        <div className="hidden lg:grid grid-cols-12 gap-0 border-t border-b border-gray-200 min-h-[600px]">
            {/* List Side */}
            <div className="col-span-4 border-r border-gray-200 bg-gray-50/30">
                {content.items.map((item, idx) => {
                    // Highlight the first item (Automation)
                    const isHighlight = idx === 0;
                    return (
                        <button 
                            key={idx}
                            onClick={() => setActiveService(idx)}
                            className={`w-full text-left p-10 border-b border-gray-200 last:border-0 transition-all duration-500 group relative ${activeService === idx ? 'bg-white' : 'hover:bg-white'}`}
                        >
                            {/* Highlight Marker */}
                            {isHighlight && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-austral-gold"></div>
                            )}
                            
                            <div className="flex justify-between items-center mb-3">
                                <span className={`text-xs font-bold tracking-widest uppercase transition-colors ${activeService === idx || isHighlight ? 'text-austral-clay' : 'text-gray-500'}`}>0{idx + 1}</span>
                                {activeService === idx && <ArrowUpRight className="w-4 h-4 text-austral-gold animate-fade-in" />}
                            </div>
                            <h3 className={`text-2xl font-serif transition-colors ${activeService === idx ? 'text-austral-dark' : 'text-gray-600 group-hover:text-austral-dark'} ${isHighlight ? 'font-bold' : ''}`}>
                                {item.title}
                            </h3>
                            {/* Underline hover effect */}
                            <div className={`h-[1px] bg-austral-clay mt-2 transition-all duration-500 ${activeService === idx ? 'w-12' : 'w-0 group-hover:w-8'}`}></div>

                            {isHighlight && (
                                <span className="text-[10px] uppercase tracking-wider text-austral-gold mt-4 block font-bold">Flagship Service</span>
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Detail Side */}
            <div className="col-span-8 p-16 xl:p-24 flex flex-col justify-center bg-white relative overflow-hidden">
                 
                 <div key={activeService} className="animate-fade-in relative z-10">
                     <div className="mb-6 inline-block p-3 rounded-full bg-gray-50 border border-gray-100">
                        {React.createElement(icons[activeService] || Layout, { size: 24, className: "text-austral-clay" })}
                     </div>

                     <h3 className="text-4xl md:text-5xl font-serif mb-8 text-austral-dark leading-tight">
                        {content.items[activeService].title}
                     </h3>
                     <p className="text-2xl font-light leading-relaxed mb-12 text-gray-800 max-w-lg">
                        {content.items[activeService].desc}
                     </p>
                     
                     <div className="grid md:grid-cols-2 gap-12 pt-12 border-t border-gray-100">
                         <div>
                            <h4 className="text-xs uppercase tracking-widest font-bold mb-6 text-austral-gold">Deep Dive</h4>
                            <p className="text-gray-900 leading-relaxed text-base font-light max-w-xs">
                                {content.items[activeService].detailedDesc}
                            </p>
                         </div>
                         <div>
                            <h4 className="text-xs uppercase tracking-widest font-bold mb-6 text-austral-gold">Features</h4>
                            <ul className="space-y-4">
                                {content.items[activeService].features?.map((feature, fIdx) => (
                                    <li key={fIdx} className="text-sm text-gray-900 flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 bg-austral-clay rounded-full"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                         </div>
                     </div>
                 </div>
            </div>
        </div>

        {/* Mobile Accordion Layout */}
        <div className="lg:hidden flex flex-col border-t border-gray-200">
             {content.items.map((item, idx) => {
                const isActive = activeService === idx;
                const isHighlight = idx === 0;
                return (
                    <div key={idx} className="border-b border-gray-200 last:border-0">
                        <button 
                            onClick={() => setActiveService(isActive ? -1 : idx)}
                            className={`w-full py-8 flex justify-between items-center text-left ${isHighlight ? 'bg-austral-clay/5 px-4' : 'px-2'}`}
                        >
                            <div className="flex items-center gap-4">
                                <span className={`text-xs font-bold ${isHighlight ? 'text-austral-clay' : 'text-gray-400'}`}>0{idx+1}</span>
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-serif text-austral-dark">{item.title}</h3>
                                    {isHighlight && <span className="text-[10px] uppercase text-austral-gold font-bold tracking-wider mt-1">Recomendado</span>}
                                </div>
                            </div>
                            {isActive ? <Minus className="w-5 h-5 text-austral-clay" /> : <Plus className="w-5 h-5 text-gray-400" />}
                        </button>
                        
                        <div className={`overflow-hidden transition-all duration-500 ease-in-out px-4 ${isActive ? 'max-h-[800px] opacity-100 pb-8' : 'max-h-0 opacity-0'}`}>
                            <p className="text-xl font-light mb-6 text-gray-900 leading-relaxed">{item.desc}</p>
                            <p className="text-sm text-gray-800 mb-6 leading-relaxed border-l-2 border-austral-gold pl-4 max-w-lg">{item.detailedDesc}</p>
                            <ul className="space-y-3 pl-4">
                                {item.features?.map((feature, fIdx) => (
                                    <li key={fIdx} className="text-sm text-gray-700 flex items-center gap-2">
                                        <div className="w-1 h-1 bg-austral-clay rounded-full"></div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )
             })}
        </div>

        {/* Tech Stack Bar */}
        <div className="py-16 md:py-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <h4 className="text-xs uppercase tracking-widest font-bold text-austral-clay whitespace-nowrap">
              {content.stackTitle}
            </h4>
            <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-4">
              {content.stack?.map((tech, i) => (
                <span key={i} className="text-lg font-serif italic text-gray-400 hover:text-austral-dark transition-colors cursor-default">{tech}</span>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Cultural/Aesthetic visual break - Monochrome Andes */}
      <div className="h-48 md:h-80 w-full overflow-hidden relative">
            <img 
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop" 
                alt="Andes Monochrome" 
                className="w-full h-full object-cover grayscale contrast-125 opacity-80"
            />
        </div>
    </section>
  );
};

export default Services;