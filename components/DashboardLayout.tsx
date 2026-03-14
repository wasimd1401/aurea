import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';
import { useUserProfile, PLAN_LABELS } from '../lib/useUserProfile';
import { LayoutDashboard, Sparkles, Image, FolderOpen, Settings, LogOut, Menu, X, ChevronRight, Crown } from 'lucide-react';

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, emoji: '🏠' },
  { label: 'Content Studio', href: '/content-studio', icon: Sparkles, emoji: '📝' },
  { label: 'Image Creator', href: '/image-creator', icon: Image, emoji: '🎨' },
  { label: 'Mi contenido', href: '/my-content', icon: FolderOpen, emoji: '📁' },
  { label: 'Configuración', href: '/settings', icon: Settings, emoji: '⚙️' },
];

const PLAN_COLORS: Record<string, string> = {
  free: 'bg-surface-300 text-surface-700',
  starter: 'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  growth: 'bg-accent/15 text-accent border border-accent/20',
  business: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
  agency: 'bg-rose-500/15 text-rose-400 border border-rose-500/20',
};

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const { profile, plan, planLabel } = useUserProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Usuario';

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface-100 border-r border-surface-200 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-surface-200">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">O</span>
            </div>
            <span className="text-lg font-bold text-white">Onyx Labs</span>
          </Link>
        </div>

        {/* Navigation */}
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
                <span className="text-base w-5 text-center">{item.emoji}</span>
                {item.label}
                {active && <ChevronRight className="w-4 h-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-surface-200">
          {/* Plan badge */}
          <div className="px-3 mb-3">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${PLAN_COLORS[plan] || PLAN_COLORS.free}`}>
              <Crown className="w-3 h-3" />
              Plan {planLabel}
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-surface-300 flex items-center justify-center text-sm font-medium text-white flex-shrink-0">
              {displayName[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{displayName}</p>
              <p className="text-xs text-surface-500 truncate">{user?.email || ''}</p>
            </div>
          </div>

          {/* Logout */}
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
