import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { LayoutDashboard, Sparkles, Image, Settings, LogOut, Menu, X, ChevronRight } from 'lucide-react';

const sidebarItems = [
  { label: 'Inicio', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Estudio de Contenido', href: '/content-studio', icon: Sparkles },
  { label: 'Creador de Imágenes', href: '/image-creator', icon: Image },
  { label: 'Configuración', href: '/settings', icon: Settings },
];

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface-100 border-r border-surface-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 border-b border-surface-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">O</span>
            </div>
            <span className="text-lg font-bold text-white">Onyx Labs</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? 'bg-accent/10 text-accent'
                    : 'text-surface-600 hover:text-white hover:bg-surface-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-surface-200">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-surface-300 flex items-center justify-center text-sm font-medium text-white">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.email || 'Usuario'}</p>
              <p className="text-xs text-surface-500">Plan Inicio</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-surface-500 hover:text-red-400 hover:bg-surface-200 transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center justify-between p-4 border-b border-surface-200 bg-surface-100">
          <button onClick={() => setSidebarOpen(true)} className="text-white">
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-lg font-bold text-white">Onyx Labs</span>
          <div className="w-6" />
        </header>

        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
