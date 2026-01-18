import React, { useMemo, useState } from 'react';
import { CONTENT } from '../constants';
import { Language } from '../types';
import { CheckCircle2, ClipboardList } from 'lucide-react';

interface ContactProps {
  lang: Language;
}

const buildBrief = (name: string, focus: string, goal: string, diet: string, city: string, lang: Language) => {
  const headline = lang === 'es'
    ? `Resumen para ${name}`
    : `Brief for ${name}`;

  const priorities = [
    lang === 'es' ? `Enfoque semanal: ${focus}` : `Weekly focus: ${focus}`,
    lang === 'es' ? `Meta fitness: ${goal}` : `Fitness goal: ${goal}`,
    lang === 'es' ? `Nutrición: ${diet}` : `Nutrition: ${diet}`,
    lang === 'es' ? `Ciudad base: ${city}` : `Home city: ${city}`,
  ];

  const nextSteps = lang === 'es'
    ? [
        'Crear agenda con bloques de foco diarios.',
        'Programar las sesiones de gimnasio y recuperación.',
        'Preparar menú semanal con compras clave.',
      ]
    : [
        'Create a daily agenda with focus blocks.',
        'Schedule gym sessions and recovery.',
        'Prepare a weekly menu and shopping list.',
      ];

  return { headline, priorities, nextSteps };
};

const Contact: React.FC<ContactProps> = ({ lang }) => {
  const content = CONTENT[lang].contact;
  const [formData, setFormData] = useState({
    name: 'Fadi',
    focus: lang === 'es' ? 'Crecimiento del negocio + rendimiento físico' : 'Business growth + peak performance',
    trainingGoal: lang === 'es' ? 'Ganar fuerza y mantener definición' : 'Build strength while staying lean',
    dietaryStyle: lang === 'es' ? 'Alto en proteína, bajo en azúcar' : 'High-protein, low sugar',
    homeCity: 'Dubai',
  });
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const brief = useMemo(
    () => buildBrief(formData.name, formData.focus, formData.trainingGoal, formData.dietaryStyle, formData.homeCity, lang),
    [formData, lang]
  );

  return (
    <section id="setup" className="py-32 px-6 md:px-12 bg-white text-austral-dark border-t border-gray-100">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20">
        <div>
          <h2 className="text-5xl md:text-6xl font-serif mb-8 text-austral-clay">{content.title}</h2>
          <p className="text-gray-700 text-lg mb-10 max-w-xl">{content.subtitle}</p>

          <div className="space-y-4">
            {content.highlights.map((item) => (
              <div key={item} className="flex items-center gap-4">
                <CheckCircle2 className="w-5 h-5 text-austral-gold" />
                <span className="text-sm uppercase tracking-wider text-gray-600">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 border border-gray-100 p-6 bg-gray-50">
            <div className="flex items-center gap-3 mb-4">
              <ClipboardList className="w-5 h-5 text-austral-clay" />
              <h3 className="text-xl font-serif text-austral-dark">{content.result.title}</h3>
            </div>
            <p className="text-gray-800 font-medium mb-4">{brief.headline}</p>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-4">
              {lang === 'es' ? 'Actualizado' : 'Updated'} {lastUpdated.toLocaleTimeString()}
            </p>
            <ul className="space-y-2 text-sm text-gray-600 mb-6">
              {brief.priorities.map((priority) => (
                <li key={priority}>• {priority}</li>
              ))}
            </ul>
            <p className="text-xs uppercase tracking-widest text-austral-clay mb-3">{content.result.nextStepsTitle}</p>
            <ul className="space-y-2 text-sm text-gray-600">
              {brief.nextSteps.map((step) => (
                <li key={step}>• {step}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 p-10 md:p-16 border border-gray-100">
          <form className="space-y-10">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-austral-dark font-bold">{content.form.name}</label>
              <input
                type="text"
                className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-austral-clay transition-colors bg-transparent text-austral-dark text-lg font-serif"
                value={formData.name}
                onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-austral-dark font-bold">{content.form.focus}</label>
              <textarea
                rows={2}
                className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-austral-clay transition-colors bg-transparent resize-none text-austral-dark text-lg font-serif"
                value={formData.focus}
                onChange={(event) => setFormData({ ...formData, focus: event.target.value })}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-austral-dark font-bold">{content.form.trainingGoal}</label>
              <textarea
                rows={2}
                className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-austral-clay transition-colors bg-transparent resize-none text-austral-dark text-lg font-serif"
                value={formData.trainingGoal}
                onChange={(event) => setFormData({ ...formData, trainingGoal: event.target.value })}
              ></textarea>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-austral-dark font-bold">{content.form.dietaryStyle}</label>
              <input
                type="text"
                className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-austral-clay transition-colors bg-transparent text-austral-dark text-lg font-serif"
                value={formData.dietaryStyle}
                onChange={(event) => setFormData({ ...formData, dietaryStyle: event.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-austral-dark font-bold">{content.form.homeCity}</label>
              <input
                type="text"
                className="w-full border-b border-gray-300 py-3 focus:outline-none focus:border-austral-clay transition-colors bg-transparent text-austral-dark text-lg font-serif"
                value={formData.homeCity}
                onChange={(event) => setFormData({ ...formData, homeCity: event.target.value })}
              />
            </div>

            <button
              type="button"
              onClick={() => setLastUpdated(new Date())}
              className="w-full bg-austral-dark text-white py-5 font-serif italic text-lg hover:bg-austral-clay transition-colors duration-300 shadow-xl shadow-gray-200"
            >
              {content.form.submit}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
