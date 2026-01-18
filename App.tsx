import React, { useMemo, useState } from 'react';
import {
  CalendarCheck,
  Dumbbell,
  FileText,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageSquareText,
  Settings,
  Utensils,
} from 'lucide-react';
import AssistantWorkspace from './components/AssistantWorkspace';
import { CONTENT } from './constants';
import { Language } from './types';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('en');
  const [activePanel, setActivePanel] = useState('overview');
  const content = CONTENT[lang];

  const navItems = useMemo(
    () => [
      { id: 'overview', label: content.nav.overview, icon: LayoutDashboard },
      { id: 'executive', label: content.nav.executive, icon: CalendarCheck },
      { id: 'concierge', label: content.nav.concierge, icon: MapPin },
      { id: 'training', label: content.nav.training, icon: Dumbbell },
      { id: 'nutrition', label: content.nav.nutrition, icon: Utensils },
      { id: 'comms', label: content.nav.comms, icon: Mail },
      { id: 'documents', label: content.nav.documents, icon: FileText },
      { id: 'chat', label: content.nav.chat, icon: MessageSquareText },
      { id: 'setup', label: content.nav.setup, icon: Settings },
    ],
    [content]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex">
      <aside className="w-72 border-r border-white/10 bg-slate-950 px-6 py-8 hidden lg:flex flex-col">
        <div className="mb-10">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{content.brand.eyebrow}</p>
          <h1 className="text-2xl font-serif mt-2">{content.brand.name}</h1>
          <p className="text-sm text-slate-400 mt-3">{content.brand.subtitle}</p>
        </div>
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePanel === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePanel(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition ${
                  isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="border-t border-white/10 pt-6 text-xs text-slate-500">
          <p>{content.brand.footer}</p>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="flex flex-wrap items-center justify-between gap-4 px-6 py-6 border-b border-white/10 bg-slate-950/80 backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">{content.topbar.label}</p>
            <h2 className="text-2xl font-serif mt-2">{content.topbar.title}</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 border border-white/10 rounded-full px-4 py-2">
              <span className="text-xs text-slate-400">{content.topbar.statusLabel}</span>
              <span className="text-sm text-white">{content.topbar.statusValue}</span>
            </div>
            <button
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="text-xs font-semibold border border-white/10 px-4 py-2 rounded-full text-slate-200 hover:bg-white/10"
            >
              {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <AssistantWorkspace lang={lang} activePanel={activePanel} />
        </main>
      </div>
    </div>
  );
};

export default App;
