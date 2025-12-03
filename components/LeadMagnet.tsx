import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Sparkles, Loader2, Lightbulb, Palette, Target, Image as ImageIcon } from 'lucide-react';
import { CONTENT } from '../constants';
import { Language, GeneratorResult, LoadState } from '../types';
import { generateConcepts } from '../services/geminiService';

interface CreativeGeneratorProps {
  lang: Language;
}

const CreativeGenerator: React.FC<CreativeGeneratorProps> = ({ lang }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const content = CONTENT[lang].generator;
  
  const [formData, setFormData] = useState({
    brandName: '',
    product: '',
    audience: ''
  });
  const [status, setStatus] = useState<LoadState>(LoadState.IDLE);
  const [result, setResult] = useState<GeneratorResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName || !formData.product) return;

    setStatus(LoadState.LOADING);
    try {
      const data = await generateConcepts(formData.brandName, formData.product, formData.audience, lang);
      setResult(data);
      setStatus(LoadState.SUCCESS);
    } catch (error) {
      console.error(error);
      setStatus(LoadState.ERROR);
    }
  };

  return (
    <section id="generator" className="py-32 px-6 md:px-12 bg-austral-dark text-white relative overflow-hidden">
      {/* Background Effect - Minimal Dark */}
      <div className="absolute inset-0 z-0 bg-austral-dark">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-austral-clay/10 rounded-full blur-[120px] opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-austral-gold/5 rounded-full blur-[100px] opacity-10"></div>
      </div>

      <div ref={ref} className={`max-w-6xl mx-auto relative z-10 transition-all duration-1000 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        <div className="text-center mb-20 max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1 border border-austral-gold/30 text-austral-gold text-[10px] tracking-[0.2em] uppercase">
            <Sparkles className="w-3 h-3" />
            <span>AI Creative Engine</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white leading-tight">
            {content.title}
          </h2>
          <p className="text-gray-400 text-xl font-light">
            {content.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Input Section - Tactile Card */}
            <div className="lg:col-span-4">
                 <form onSubmit={handleSubmit} className="space-y-8 bg-white/5 p-8 border border-white/10 rounded-sm shadow-2xl backdrop-blur-sm">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold mb-3 text-austral-gold">{content.inputLabel1}</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Aurea"
                        className="w-full bg-transparent border-b border-gray-700 py-3 text-xl text-white focus:outline-none focus:border-austral-gold transition-colors placeholder-gray-700 font-serif italic"
                        value={formData.brandName}
                        onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold mb-3 text-austral-gold">{content.inputLabel2}</label>
                      <input 
                        type="text"
                        required
                        placeholder={lang === 'es' ? "e.g. Café de especialidad" : "e.g. Specialty coffee"}
                        className="w-full bg-transparent border-b border-gray-700 py-3 text-xl text-white focus:outline-none focus:border-austral-gold transition-colors placeholder-gray-700 font-serif italic"
                        value={formData.product}
                        onChange={(e) => setFormData({...formData, product: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider font-bold mb-3 text-austral-gold">{content.inputLabel3}</label>
                      <input 
                        type="text" 
                        required
                        placeholder={lang === 'es' ? "e.g. Millenials urbanos" : "e.g. Urban Millennials"}
                        className="w-full bg-transparent border-b border-gray-700 py-3 text-xl text-white focus:outline-none focus:border-austral-gold transition-colors placeholder-gray-700 font-serif italic"
                        value={formData.audience}
                        onChange={(e) => setFormData({...formData, audience: e.target.value})}
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={status === LoadState.LOADING}
                    className="w-full bg-austral-gold text-austral-dark py-5 px-6 flex items-center justify-center gap-4 hover:bg-white transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group rounded-sm shadow-lg shadow-austral-gold/10"
                  >
                    <span className="font-serif italic text-lg font-bold">
                      {status === LoadState.LOADING ? '' : content.cta}
                    </span>
                    {status === LoadState.LOADING ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </button>
                  
                  {/* Microcopy */}
                  <div className="text-center space-y-2">
                     <p className="text-[10px] text-gray-500 tracking-widest uppercase">{content.microcopy}</p>
                     {status === LoadState.IDLE && (
                         <p className="text-[10px] text-gray-600 italic">{content.example}</p>
                     )}
                  </div>
                </form>
            </div>

            {/* Results Section */}
            <div className="lg:col-span-8 min-h-[600px] flex items-center justify-center bg-white/5 rounded-sm border border-white/5 relative">
                {status === LoadState.IDLE && (
                    <div className="text-center text-white/20 p-8">
                        <Lightbulb className="w-16 h-16 mx-auto mb-6 stroke-[0.5]" />
                        <p className="font-serif text-3xl italic opacity-50 mb-2">{lang === 'es' ? 'Esperando input...' : 'Awaiting input...'}</p>
                        <p className="text-xs uppercase tracking-widest opacity-40">System Ready</p>
                    </div>
                )}
                
                {status === LoadState.LOADING && (
                    <div className="w-full max-w-md p-8 text-center">
                        <div className="mb-8 relative h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                           <div className="absolute top-0 left-0 h-full bg-austral-gold animate-[progress_2s_ease-in-out_infinite] w-1/3"></div>
                        </div>
                        <p className="font-serif text-2xl animate-pulse text-austral-gold">{content.loading}</p>
                    </div>
                )}

                {status === LoadState.SUCCESS && result && (
                    <div className="w-full animate-fade-in p-8 md:p-12">
                         <div className="mb-12 border-l-2 border-austral-gold pl-6">
                            <p className="text-lg font-light text-gray-300 italic">
                                "{result.brandVoiceAnalysis}"
                            </p>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            {result.concepts.map((concept, idx) => (
                                <div key={idx} className="bg-white text-austral-dark flex flex-col group overflow-hidden shadow-2xl">
                                    
                                    {/* Consistent Static Image */}
                                    <div className="w-full aspect-[4/3] relative overflow-hidden bg-gray-200">
                                        <img 
                                            src={concept.imageUrl} 
                                            alt={concept.title} 
                                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span className="bg-white text-austral-dark text-[10px] font-bold tracking-widest px-3 py-1 uppercase">
                                                Concept 0{idx + 1}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 flex-grow flex flex-col bg-white">
                                        <h3 className="text-2xl font-serif font-bold text-austral-dark mb-2">{concept.title}</h3>
                                        <p className="text-austral-clay font-medium italic mb-6 text-sm">"{concept.tagline}"</p>
                                        
                                        <div className="space-y-4 mt-auto border-t border-gray-100 pt-6">
                                            <div className="flex gap-3">
                                                <Target className="w-4 h-4 text-austral-gold shrink-0 mt-1" />
                                                <p className="text-xs text-gray-600 leading-relaxed">{concept.rationale}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                         <div className="text-center mt-12">
                            <button 
                                onClick={() => setStatus(LoadState.IDLE)} 
                                className="text-gray-500 text-xs uppercase tracking-widest hover:text-white transition-colors"
                            >
                                {lang === 'es' ? 'Reiniciar' : 'Reset'}
                            </button>
                        </div>
                    </div>
                )}

                {status === LoadState.ERROR && (
                    <div className="text-center">
                         <p className="text-red-400 mb-4">Error.</p>
                         <button onClick={() => setStatus(LoadState.IDLE)} className="underline">Retry</button>
                    </div>
                )}
            </div>
        </div>

      </div>
    </section>
  );
};

export default CreativeGenerator;