import React, { useState } from 'react';
import { useAuth } from '../lib/AuthContext';
import { Settings, User, Mic, CreditCard, Save } from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'brand', label: 'Voz de marca', icon: Mic },
  { id: 'billing', label: 'Facturación', icon: CreditCard },
];

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="w-6 h-6 text-surface-400" />
          Configuración
        </h1>
        <p className="text-surface-500 mt-1">Administra tu perfil, voz de marca y facturación.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface-100 rounded-lg p-1 mb-8 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-surface-200 text-white'
                  : 'text-surface-500 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Profile tab */}
      {activeTab === 'profile' && (
        <div className="bg-surface-100 border border-surface-200 rounded-xl p-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-white mb-6">Información del perfil</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-600 mb-1.5">Email</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-surface-200 border border-surface-300 rounded-lg px-4 py-3 text-surface-400 text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-600 mb-1.5">Nombre completo</label>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full bg-surface border border-surface-200 rounded-lg px-4 py-3 text-white text-sm placeholder-surface-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-600 mb-1.5">Empresa / Marca</label>
              <input
                type="text"
                placeholder="Nombre de tu negocio"
                className="w-full bg-surface border border-surface-200 rounded-lg px-4 py-3 text-white text-sm placeholder-surface-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
            <button className="flex items-center gap-2 bg-accent hover:bg-accent-light text-black font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm mt-2">
              <Save className="w-4 h-4" />
              Guardar cambios
            </button>
          </div>
        </div>
      )}

      {/* Brand voice tab */}
      {activeTab === 'brand' && (
        <div className="bg-surface-100 border border-surface-200 rounded-xl p-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-white mb-2">Voz de marca</h2>
          <p className="text-sm text-surface-500 mb-6">Define el tono y personalidad de tu marca para que todo el contenido sea consistente.</p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-600 mb-1.5">Nombre de la marca</label>
              <input
                type="text"
                placeholder="Ej: Mi Tienda Online"
                className="w-full bg-surface border border-surface-200 rounded-lg px-4 py-3 text-white text-sm placeholder-surface-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-600 mb-1.5">Tono de voz</label>
              <select className="w-full bg-surface border border-surface-200 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent">
                <option value="">Selecciona un tono</option>
                <option value="professional">Profesional</option>
                <option value="casual">Casual y cercano</option>
                <option value="bold">Audaz y directo</option>
                <option value="inspiring">Inspirador</option>
                <option value="humorous">Humorístico</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-surface-600 mb-1.5">Descripción de la marca</label>
              <textarea
                rows={4}
                placeholder="Describe tu marca, público objetivo y valores principales..."
                className="w-full bg-surface border border-surface-200 rounded-lg px-4 py-3 text-white text-sm placeholder-surface-400 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent resize-none"
              />
            </div>
            <button className="flex items-center gap-2 bg-accent hover:bg-accent-light text-black font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm mt-2">
              <Save className="w-4 h-4" />
              Guardar voz de marca
            </button>
          </div>
        </div>
      )}

      {/* Billing tab */}
      {activeTab === 'billing' && (
        <div className="bg-surface-100 border border-surface-200 rounded-xl p-6 max-w-2xl">
          <h2 className="text-lg font-semibold text-white mb-2">Facturación</h2>
          <p className="text-sm text-surface-500 mb-6">Administra tu plan y método de pago.</p>

          <div className="bg-surface border border-surface-200 rounded-lg p-5 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Plan actual</p>
                <p className="text-2xl font-bold text-white mt-1">Inicio <span className="text-sm font-normal text-surface-500">— Gratis</span></p>
              </div>
              <a href="/pricing" className="bg-accent hover:bg-accent-light text-black font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
                Mejorar plan
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-surface-200">
              <span className="text-sm text-surface-500">Generaciones de texto</span>
              <span className="text-sm text-white">0 / 10</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-surface-200">
              <span className="text-sm text-surface-500">Imágenes generadas</span>
              <span className="text-sm text-white">0 / 5</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-surface-500">Voces de marca</span>
              <span className="text-sm text-white">0 / 1</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
