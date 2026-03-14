import React from 'react';
import { Link } from 'react-router-dom';
import { useUserProfile } from '../lib/useUserProfile';
import { Sparkles, Image, ArrowRight, FileText, Palette, Clock } from 'lucide-react';
import type { RecentItem } from '../lib/useUserProfile';

function formatLimit(n: number): string {
  return n === Infinity ? '∞' : String(n);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Ahora';
  if (diffMin < 60) return `Hace ${diffMin}m`;
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return `Hace ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 7) return `Hace ${diffD}d`;
  return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

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

const Dashboard: React.FC = () => {
  const { profile, usage, recentItems, loading, limits } = useUserProfile();

  const contentUsed = usage?.content_count ?? 0;
  const imageUsed = usage?.image_count ?? 0;
  const contentPct = limits.content === Infinity ? 0 : Math.min((contentUsed / limits.content) * 100, 100);
  const imagePct = limits.images === Infinity ? 0 : Math.min((imageUsed / limits.images) * 100, 100);

  const displayName = profile?.full_name || profile?.email?.split('@')[0] || 'emprendedor';

  return (
    <div className="max-w-4xl">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Hola, {displayName} 👋
        </h1>
        <p className="text-surface-500 mt-1">Aquí tienes un resumen de tu actividad este mes.</p>
      </div>

      {/* Usage stats */}
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {/* Content usage */}
        <div className="bg-surface-100 border border-surface-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-accent" />
              </div>
              <span className="text-sm font-medium text-surface-600">Contenido generado</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-3xl font-bold text-white">{contentUsed}</span>
            <span className="text-surface-500 text-sm">/ {formatLimit(limits.content)}</span>
          </div>
          {limits.content !== Infinity && (
            <div className="w-full h-1.5 bg-surface-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${contentPct > 80 ? 'bg-red-400' : 'bg-accent'}`}
                style={{ width: `${contentPct}%` }}
              />
            </div>
          )}
          {limits.content === Infinity && (
            <p className="text-xs text-surface-400">Uso ilimitado</p>
          )}
        </div>

        {/* Image usage */}
        <div className="bg-surface-100 border border-surface-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Image className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-sm font-medium text-surface-600">Imágenes creadas</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 mb-3">
            <span className="text-3xl font-bold text-white">{imageUsed}</span>
            <span className="text-surface-500 text-sm">/ {formatLimit(limits.images)}</span>
          </div>
          {limits.images !== Infinity && (
            <div className="w-full h-1.5 bg-surface-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${imagePct > 80 ? 'bg-red-400' : 'bg-blue-400'}`}
                style={{ width: `${imagePct}%` }}
              />
            </div>
          )}
          {limits.images === Infinity && (
            <p className="text-xs text-surface-400">Uso ilimitado</p>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-semibold text-white mb-4">Acciones rápidas</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        <Link
          to="/content-studio"
          className="bg-surface-100 border border-surface-200 rounded-xl p-6 hover:border-accent/30 hover:bg-accent/5 transition-all group"
        >
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
            <Sparkles className="w-5 h-5 text-accent" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
            Crear contenido
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-sm text-surface-500">Genera textos para 5 redes sociales a la vez</p>
        </Link>

        <Link
          to="/image-creator"
          className="bg-surface-100 border border-surface-200 rounded-xl p-6 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group"
        >
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
            <Palette className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
            Crear imagen
            <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-sm text-surface-500">Diseña imágenes únicas con IA para tu marca</p>
        </Link>
      </div>

      {/* Recent generations */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Generaciones recientes</h2>
        {recentItems.length > 0 && (
          <Link to="/my-content" className="text-sm text-accent hover:text-accent-light font-medium flex items-center gap-1">
            Ver todo
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="bg-surface-100 border border-surface-200 rounded-xl p-12 text-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : recentItems.length === 0 ? (
        <div className="bg-surface-100 border border-surface-200 rounded-xl p-12 text-center">
          <Clock className="w-10 h-10 text-surface-300 mx-auto mb-3" />
          <p className="text-white font-medium mb-1">Sin actividad aún</p>
          <p className="text-surface-500 text-sm mb-4">Tus generaciones de contenido e imágenes aparecerán aquí.</p>
          <Link
            to="/content-studio"
            className="inline-flex items-center gap-2 text-accent hover:text-accent-light text-sm font-medium"
          >
            Crear tu primer contenido
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="bg-surface-100 border border-surface-200 rounded-xl divide-y divide-surface-200">
          {recentItems.map((item) => (
            <RecentRow key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

const RecentRow: React.FC<{ item: RecentItem }> = ({ item }) => {
  const isContent = item.type === 'content';
  return (
    <div className="flex items-center gap-4 px-5 py-4 hover:bg-surface-200/50 transition-colors">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isContent ? 'bg-accent/10' : 'bg-blue-500/10'}`}>
        {isContent ? (
          <FileText className="w-4 h-4 text-accent" />
        ) : (
          <Image className="w-4 h-4 text-blue-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{item.title}</p>
        <p className="text-xs text-surface-500">
          {isContent
            ? PLATFORM_LABELS[item.subtitle] || item.subtitle
            : STYLE_LABELS[item.subtitle] || item.subtitle}
        </p>
      </div>
      <span className="text-xs text-surface-400 flex-shrink-0">{formatDate(item.created_at)}</span>
    </div>
  );
};

export default Dashboard;
