import React from 'react';
import { Sparkles, FileText, MessageSquare, Mail, Hash, Megaphone } from 'lucide-react';

const contentTypes = [
  { title: 'Post para redes', description: 'Instagram, X, LinkedIn, Facebook', icon: Hash },
  { title: 'Artículo de blog', description: 'Posts largos optimizados para SEO', icon: FileText },
  { title: 'Email marketing', description: 'Campañas, newsletters, secuencias', icon: Mail },
  { title: 'Copy publicitario', description: 'Anuncios, landing pages, CTAs', icon: Megaphone },
  { title: 'Guiones de video', description: 'TikTok, Reels, YouTube Shorts', icon: MessageSquare },
];

const ContentStudio: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-accent" />
          Estudio de Contenido
        </h1>
        <p className="text-surface-500 mt-1">Genera textos profesionales con inteligencia artificial.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentTypes.map((type) => {
          const Icon = type.icon;
          return (
            <button
              key={type.title}
              className="bg-surface-100 border border-surface-200 rounded-xl p-6 text-left hover:border-accent/30 hover:bg-accent/5 transition-colors group"
            >
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1">{type.title}</h3>
              <p className="text-sm text-surface-500">{type.description}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-8 bg-surface-100 border border-surface-200 rounded-xl p-12 text-center">
        <Sparkles className="w-10 h-10 text-surface-300 mx-auto mb-3" />
        <p className="text-white font-medium mb-1">Próximamente</p>
        <p className="text-surface-500 text-sm max-w-md mx-auto">
          Selecciona un tipo de contenido arriba para generar textos con IA. Esta funcionalidad estará disponible pronto.
        </p>
      </div>
    </div>
  );
};

export default ContentStudio;
