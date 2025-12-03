import React from 'react';
import { CONTENT } from '../constants';
import { Language } from '../types';
import { MessageCircle, Mail, MapPin, Clock } from 'lucide-react';

interface ContactProps {
  lang: Language;
}

const Contact: React.FC<ContactProps> = ({ lang }) => {
  const content = CONTENT[lang].contact;

  return (
    <section id="contact" className="py-32 px-6 md:px-12 bg-white text-austral-dark border-t border-gray-100">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
        
        {/* Contact Info */}
        <div>
          <h2 className="text-5xl md:text-6xl font-serif mb-16 text-austral-clay">
            {content.title}
          </h2>
          
          <div className="space-y-12">
            {/* WhatsApp - Highlighted */}
            <div className="flex items-start gap-6 group">
              <div className="p-4 bg-green-50 border border-green-100 rounded-full group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-green-700" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-xl font-bold">{content.whatsapp}</h3>
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {content.whatsappBadge}
                    </span>
                </div>
                <a 
                  href={content.phoneLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-2xl font-serif italic text-austral-dark hover:text-green-700 transition-colors border-b border-transparent hover:border-green-700"
                >
                  {content.phoneDisplay}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6 group">
               <div className="p-4 bg-gray-50 border border-gray-100 rounded-full group-hover:bg-gray-100 transition-colors">
                <Mail className="w-6 h-6 text-austral-clay" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Email</h3>
                <a href={`mailto:${content.email}`} className="text-xl font-serif text-gray-900 hover:text-austral-clay transition-colors">
                  {content.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-6">
               <div className="p-4 bg-gray-50 border border-gray-100 rounded-full">
                <MapPin className="w-6 h-6 text-gray-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">{lang === 'es' ? 'Oficina' : 'Office'}</h3>
                <p className="text-gray-600 font-light">
                  El Golf, Las Condes<br />
                  Santiago, Chile
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Minimalist Form */}
        <div className="bg-gray-50 p-10 md:p-16 border border-gray-100">
          <form className="space-y-10">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-austral-dark font-bold">{content.form.name}</label>
              <input type="text" className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-austral-clay transition-colors bg-transparent text-austral-dark placeholder-gray-400 text-lg font-serif" />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-austral-dark font-bold">{content.form.email}</label>
              <input type="email" className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-austral-clay transition-colors bg-transparent text-austral-dark placeholder-gray-400 text-lg font-serif" />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-austral-dark font-bold">{content.form.message}</label>
              <textarea rows={3} className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-austral-clay transition-colors bg-transparent resize-none text-austral-dark placeholder-gray-400 text-lg font-serif"></textarea>
            </div>

            <button type="button" className="w-full bg-austral-dark text-white py-5 font-serif italic text-lg hover:bg-austral-clay transition-colors duration-300 shadow-xl shadow-gray-200">
              {content.form.submit}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;