import React, { useState, useEffect } from 'react';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { FolderOpen, FileText, Image, Clock, Search } from 'lucide-react';
import type { RecentItem } from '../lib/useUserProfile';

const PLATFORM_LABELS: Record<string, string> = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  twitter: 'X / Twitter',
};

const STYLE_LABELS: Record<string, string> = {
  minimalista: 'Minimalista',
  bold: 'Bold',
  elegante: 'Elegante',
  creativo: 'Creativo',
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

type Filter = 'all' | 'content' | 'image';

const MyContent: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<RecentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      setLoading(true);

      const [{ data: contentData }, { data: imageData }] = await Promise.all([
        supabase
          .from('content_generations')
          .select('id, input_idea, platform, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('image_generations')
          .select('id, prompt, style, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      const merged: RecentItem[] = [];
      if (contentData) {
        for (const c of contentData) {
          merged.push({ id: c.id, type: 'content', title: c.input_idea, subtitle: c.platform, created_at: c.created_at });
        }
      }
      if (imageData) {
        for (const img of imageData) {
          merged.push({ id: img.id, type: 'image', title: img.prompt, subtitle: img.style, created_at: img.created_at });
        }
      }
      merged.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setItems(merged);
      setLoading(false);
    };

    fetchAll();
  }, [user]);

  const filtered = items.filter((item) => {
    if (filter !== 'all' && item.type !== filter) return false;
    if (search && !item.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <FolderOpen className="w-6 h-6 text-surface-400" />
          Mi contenido
        </h1>
        <p className="text-surface-500 mt-1">Historial de todas tus generaciones.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-surface-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título..."
            className="w-full bg-surface-100 border border-surface-200 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm placeholder-surface-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="flex gap-1 bg-surface-100 rounded-lg p-1">
          {([['all', 'Todo'], ['content', 'Contenido'], ['image', 'Imágenes']] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === key ? 'bg-surface-200 text-white' : 'text-surface-500 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Items list */}
      {loading ? (
        <div className="bg-surface-100 border border-surface-200 rounded-xl p-12 text-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-100 border border-surface-200 rounded-xl p-12 text-center">
          <Clock className="w-10 h-10 text-surface-300 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">
            {items.length === 0 ? 'Sin contenido aún' : 'Sin resultados'}
          </p>
          <p className="text-surface-500 text-sm">
            {items.length === 0
              ? 'Tus generaciones aparecerán aquí cuando empieces a crear.'
              : 'Intenta con otros filtros o términos de búsqueda.'}
          </p>
        </div>
      ) : (
        <div className="bg-surface-100 border border-surface-200 rounded-xl divide-y divide-surface-200">
          {filtered.map((item) => {
            const isContent = item.type === 'content';
            return (
              <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-surface-200/50 transition-colors">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isContent ? 'bg-accent/10' : 'bg-blue-500/10'}`}>
                  {isContent ? <FileText className="w-4 h-4 text-accent" /> : <Image className="w-4 h-4 text-blue-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{item.title}</p>
                  <p className="text-xs text-surface-500">
                    {isContent ? PLATFORM_LABELS[item.subtitle] || item.subtitle : STYLE_LABELS[item.subtitle] || item.subtitle}
                  </p>
                </div>
                <span className="text-xs text-surface-400 flex-shrink-0 hidden sm:block">{formatDate(item.created_at)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyContent;
