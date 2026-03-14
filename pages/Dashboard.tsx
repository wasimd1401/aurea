import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { Sparkles, Image, TrendingUp, FileText, ArrowRight } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Estudio de Contenido',
      description: 'Genera textos para redes, blogs y emails',
      icon: Sparkles,
      href: '/content-studio',
      color: 'bg-amber-500/10 text-amber-400',
    },
    {
      title: 'Creador de Imágenes',
      description: 'Crea imágenes únicas para tu marca',
      icon: Image,
      href: '/image-creator',
      color: 'bg-blue-500/10 text-blue-400',
    },
  ];

  const stats = [
    { label: 'Contenidos creados', value: '0', icon: FileText },
    { label: 'Imágenes generadas', value: '0', icon: Image },
    { label: 'Engagement estimado', value: '—', icon: TrendingUp },
  ];

  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Hola, {user?.email?.split('@')[0] || 'emprendedor'} 👋
        </h1>
        <p className="text-surface-500 mt-1">Bienvenido a tu espacio de creación con IA.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-surface-100 border border-surface-200 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <Icon className="w-5 h-5 text-surface-400" />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-surface-500 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-semibold text-white mb-4">Acciones rápidas</h2>
      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              to={action.href}
              className="bg-surface-100 border border-surface-200 rounded-xl p-6 hover:border-surface-300 transition-colors group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${action.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
                {action.title}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-sm text-surface-500">{action.description}</p>
            </Link>
          );
        })}
      </div>

      {/* Activity placeholder */}
      <h2 className="text-lg font-semibold text-white mb-4">Actividad reciente</h2>
      <div className="bg-surface-100 border border-surface-200 rounded-xl p-12 text-center">
        <FileText className="w-10 h-10 text-surface-300 mx-auto mb-3" />
        <p className="text-surface-500 text-sm">Aún no tienes actividad. ¡Crea tu primer contenido!</p>
        <Link
          to="/content-studio"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-light text-sm font-medium mt-4"
        >
          Ir al Estudio de Contenido
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
