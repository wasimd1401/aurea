import React from 'react';
import { Image, Palette, Layout, Camera, Wand2 } from 'lucide-react';

const imageStyles = [
  { title: 'Post de Instagram', aspect: '1:1', icon: Camera },
  { title: 'Historia / Reel', aspect: '9:16', icon: Layout },
  { title: 'Banner de LinkedIn', aspect: '4:1', icon: Palette },
  { title: 'Miniatura de YouTube', aspect: '16:9', icon: Wand2 },
];

const ImageCreator: React.FC = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Image className="w-6 h-6 text-blue-400" />
          Creador de Imágenes
        </h1>
        <p className="text-surface-500 mt-1">Diseña imágenes únicas para tu marca con IA.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {imageStyles.map((style) => {
          const Icon = style.icon;
          return (
            <button
              key={style.title}
              className="bg-surface-100 border border-surface-200 rounded-xl p-5 text-left hover:border-blue-500/30 hover:bg-blue-500/5 transition-colors group"
            >
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-500/20 transition-colors">
                <Icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">{style.title}</h3>
              <p className="text-xs text-surface-500 mt-0.5">{style.aspect}</p>
            </button>
          );
        })}
      </div>

      <div className="bg-surface-100 border border-surface-200 rounded-xl p-12 text-center">
        <Image className="w-10 h-10 text-surface-300 mx-auto mb-3" />
        <p className="text-white font-medium mb-1">Próximamente</p>
        <p className="text-surface-500 text-sm max-w-md mx-auto">
          Describe la imagen que necesitas y la IA la creará para ti. Esta funcionalidad estará disponible pronto.
        </p>
      </div>
    </div>
  );
};

export default ImageCreator;
