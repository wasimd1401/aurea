import React from 'react';
import { CONTENT } from '../constants';
import { Language } from '../types';
import { Mail, Calendar } from 'lucide-react';

interface ContactProps {
  lang: Language;
}

const Contact: React.FC<ContactProps> = ({ lang }) => {
  const content = CONTENT[lang].contact;

  return (
    <section id="contact" className="bg-black text-white py-24 md:py-32 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="text-4xl md:text-5xl font-serif text-white leading-tight">{content.title}</h2>
          <p className="mt-4 text-gray-300 max-w-xl text-base">{content.subtitle}</p>

          <ul className="mt-10 space-y-4 text-gray-200">
            {content.highlights.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-austral-gold"></span>
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-10 space-y-4">
            <a
              href="https://calendly.com/onyx-ai-consulting/consultation"
              className="inline-flex items-center gap-3 text-sm uppercase tracking-widest text-austral-gold hover:text-white transition-colors"
            >
              <Calendar className="w-4 h-4" />
              {content.calendlyLabel}
            </a>
            <p className="text-xs text-gray-400">{content.guideNote}</p>
          </div>
        </div>

        <div className="border border-white/10 bg-white/5 p-8 rounded-2xl">
          <form className="space-y-6">
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400">{content.form.name}</label>
              <input
                type="text"
                placeholder="Jordan Lee"
                className="mt-2 w-full bg-transparent border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-austral-gold"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400">{content.form.email}</label>
              <input
                type="email"
                placeholder="you@company.com"
                className="mt-2 w-full bg-transparent border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-austral-gold"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400">{content.form.company}</label>
              <input
                type="text"
                placeholder="Company name"
                className="mt-2 w-full bg-transparent border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-austral-gold"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest text-gray-400">{content.form.message}</label>
              <textarea
                rows={4}
                placeholder="We want to speed up lead follow-up and reduce admin work."
                className="mt-2 w-full bg-transparent border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-austral-gold"
              ></textarea>
            </div>
            <button
              type="button"
              className="w-full bg-austral-clay text-white py-4 font-semibold text-sm uppercase tracking-widest hover:bg-austral-gold hover:text-austral-dark transition-colors"
            >
              <span className="inline-flex items-center gap-2 justify-center">
                <Mail className="w-4 h-4" />
                {content.form.submit}
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
