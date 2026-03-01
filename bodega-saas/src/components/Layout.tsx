import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, Package, ArrowLeftRight, Clock, AlertTriangle,
  BarChart3, Settings, CreditCard, LogOut, Globe, Menu, X, ChevronDown,
} from 'lucide-react'

export default function Layout() {
  const { t, lang, setLang } = useLanguage()
  const { profile, organization, signOut, isDemo } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const navItems = [
    { to: '/app', icon: LayoutDashboard, label: t('navDashboard'), end: true },
    { to: '/app/products', icon: Package, label: t('navProducts') },
    { to: '/app/movements', icon: ArrowLeftRight, label: t('navMovements') },
    { to: '/app/expiration', icon: Clock, label: t('navExpiry') },
    { to: '/app/losses', icon: AlertTriangle, label: t('navLoss') },
    { to: '/app/reports', icon: BarChart3, label: t('navReports') },
  ]

  const bottomItems = [
    { to: '/app/settings', icon: Settings, label: t('navSettings') },
    { to: '/app/billing', icon: CreditCard, label: t('navBilling') },
  ]

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  // Trial banner
  let trialDays = 0
  if (organization?.trial_ends_at) {
    trialDays = Math.max(0, Math.ceil((new Date(organization.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Trial banner */}
      {organization?.plan_status === 'trialing' && trialDays > 0 && (
        <div className="bg-amber-500 text-amber-950 text-center text-sm py-2 px-4 font-medium">
          {t('trialBanner', { days: trialDays })}
          <NavLink to="/app/billing" className="ml-2 underline font-semibold">
            {lang === 'es' ? 'Elegir plan' : 'Choose plan'}
          </NavLink>
        </div>
      )}

      {/* Mobile header */}
      <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-600">
          <Menu className="w-6 h-6" />
        </button>
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6 text-emerald-600" />
          <span className="font-bold text-gray-900">BodegaControl</span>
        </div>
        <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="p-2 text-gray-400">
          <Globe className="w-5 h-5" />
        </button>
      </header>

      {/* Sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 flex flex-col transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Package className="w-7 h-7 text-emerald-600" />
            <span className="font-bold text-lg text-gray-900">Bodega<span className="text-emerald-600">Control</span></span>
          </div>
          <button className="lg:hidden p-1 text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Org name */}
        <div className="px-5 py-3 border-b border-gray-100">
          <div className="text-sm font-medium text-gray-900 truncate">{organization?.name || 'Restaurante'}</div>
          <div className="text-xs text-gray-400 capitalize">{organization?.plan || 'trial'} plan</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}

          <div className="pt-4 mt-4 border-t border-gray-100">
            {bottomItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                    isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User menu */}
        <div className="border-t border-gray-100 p-3">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition"
            >
              <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-sm font-semibold">
                {(profile?.full_name || profile?.email || 'U')[0].toUpperCase()}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{profile?.full_name || 'Usuario'}</div>
                <div className="text-xs text-gray-400 truncate">{profile?.email || ''}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => { setLang(lang === 'es' ? 'en' : 'es'); setUserMenuOpen(false) }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50"
                >
                  <Globe className="w-4 h-4" /> {lang === 'es' ? 'English' : 'Español'}
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4" /> {t('logout')}
                </button>
              </div>
            )}
          </div>
          {isDemo && (
            <div className="mt-2 px-3 py-1.5 bg-amber-50 rounded-lg text-xs text-amber-700 text-center">
              Demo Mode
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
