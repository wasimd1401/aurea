import { Link } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { PLANS, type PlanKey } from '@/lib/stripe'
import {
  Package, ShieldCheck, Camera, BarChart3, ArrowRight,
  CheckCircle2, Globe, Menu, X,
} from 'lucide-react'
import { useState } from 'react'

export default function Landing() {
  const { t, lang, setLang } = useLanguage()
  const { profile } = useAuth()
  const [mobileMenu, setMobileMenu] = useState(false)

  const features = [
    { icon: ShieldCheck, title: t('feature1Title'), desc: t('feature1Desc'), color: 'text-red-500' },
    { icon: Package, title: t('feature2Title'), desc: t('feature2Desc'), color: 'text-amber-500' },
    { icon: Camera, title: t('feature3Title'), desc: t('feature3Desc'), color: 'text-blue-500' },
    { icon: BarChart3, title: t('feature4Title'), desc: t('feature4Desc'), color: 'text-emerald-500' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Package className="w-7 h-7 text-emerald-600" />
              <span className="font-bold text-xl text-gray-900">Bodega<span className="text-emerald-600">Control</span></span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition">{lang === 'es' ? 'Funciones' : 'Features'}</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition">{lang === 'es' ? 'Precios' : 'Pricing'}</a>
              <button onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-900">
                <Globe className="w-4 h-4" /> {lang === 'es' ? 'EN' : 'ES'}
              </button>
              {profile ? (
                <Link to="/app" className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition">
                  {lang === 'es' ? 'Ir al panel' : 'Go to dashboard'}
                </Link>
              ) : (
                <>
                  <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">{t('login')}</Link>
                  <Link to="/signup" className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition">
                    {t('heroCTA')}
                  </Link>
                </>
              )}
            </div>

            <button className="md:hidden" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
            <a href="#features" onClick={() => setMobileMenu(false)} className="block text-gray-600">{lang === 'es' ? 'Funciones' : 'Features'}</a>
            <a href="#pricing" onClick={() => setMobileMenu(false)} className="block text-gray-600">{lang === 'es' ? 'Precios' : 'Pricing'}</a>
            <button onClick={() => { setLang(lang === 'es' ? 'en' : 'es'); setMobileMenu(false) }} className="flex items-center gap-1 text-gray-500">
              <Globe className="w-4 h-4" /> {lang === 'es' ? 'EN' : 'ES'}
            </button>
            <Link to="/signup" onClick={() => setMobileMenu(false)} className="block w-full text-center px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg">
              {t('heroCTA')}
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            {lang === 'es' ? 'Para restaurantes en Chile y LATAM' : 'For restaurants in Chile & LATAM'}
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            {t('heroTitle')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto mb-10">
            {t('heroSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="px-8 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition shadow-lg shadow-emerald-200 flex items-center gap-2">
              {t('heroCTA')} <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/app" className="px-8 py-3.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition">
              {t('heroSecondary')}
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: '< 2%', label: lang === 'es' ? 'Meta de merma' : 'Loss target' },
              { value: '14', label: lang === 'es' ? 'Días gratis' : 'Free days' },
              { value: '24/7', label: lang === 'es' ? 'Alertas activas' : 'Active alerts' },
            ].map(s => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 bg-gray-50 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            {lang === 'es' ? 'Todo lo que necesitas para tu bodega' : 'Everything you need for your inventory'}
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">
            {lang === 'es'
              ? 'Diseñado específicamente para restaurantes. Sin complicaciones.'
              : 'Designed specifically for restaurants. No complexity.'}
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">
                <f.icon className={`w-10 h-10 ${f.color} mb-4`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">{t('pricingTitle')}</h2>
          <p className="text-center text-gray-500 mb-12 max-w-2xl mx-auto">{t('pricingSubtitle')}</p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(([key, plan]) => {
              const isPro = key === 'pro'
              return (
                <div key={key} className={`relative rounded-2xl p-8 ${isPro ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200 scale-105' : 'bg-white border border-gray-200 shadow-sm'}`}>
                  {isPro && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                      {t('mostPopular')}
                    </span>
                  )}
                  <h3 className={`text-lg font-semibold mb-2 ${isPro ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className={`text-4xl font-extrabold ${isPro ? 'text-white' : 'text-gray-900'}`}>${plan.price}</span>
                    <span className={isPro ? 'text-emerald-200' : 'text-gray-400'}>{t('perMonth')}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.features[lang].map(f => (
                      <li key={f} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isPro ? 'text-emerald-200' : 'text-emerald-500'}`} />
                        <span className={isPro ? 'text-emerald-50' : 'text-gray-600'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/signup"
                    className={`block w-full text-center py-3 rounded-xl font-semibold transition ${
                      isPro
                        ? 'bg-white text-emerald-700 hover:bg-emerald-50'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {t('choosePlan')}
                  </Link>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-emerald-600 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            {lang === 'es' ? '¿Listo para controlar tu bodega?' : 'Ready to control your inventory?'}
          </h2>
          <p className="text-emerald-100 mb-8">
            {lang === 'es'
              ? 'Empieza gratis hoy. Sin tarjeta de crédito. Configura en 5 minutos.'
              : 'Start free today. No credit card. Set up in 5 minutes.'}
          </p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-emerald-50 transition">
            {t('heroCTA')} <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-gray-900">BodegaControl</span>
          </div>
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} BodegaControl. {lang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  )
}
