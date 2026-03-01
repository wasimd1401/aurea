import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { Package, Globe } from 'lucide-react'

export default function Login() {
  const { t, lang, setLang } = useLanguage()
  const { signIn, isDemo } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (isDemo) {
      await signIn(email, password)
      navigate('/app')
      return
    }

    const { error: err } = await signIn(email, password)
    setLoading(false)
    if (err) {
      setError(err)
    } else {
      navigate('/app')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <Package className="w-8 h-8 text-emerald-600" />
            <span className="font-bold text-2xl text-gray-900">Bodega<span className="text-emerald-600">Control</span></span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">{t('loginTitle')}</h1>
        </div>

        {isDemo && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
            {lang === 'es'
              ? 'Modo demo — Supabase no configurado. Ingresa cualquier email para probar.'
              : 'Demo mode — Supabase not configured. Enter any email to try.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              placeholder="chef@mirestaurante.cl"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('password')}</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required={!isDemo}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
          >
            {loading ? t('loading') : t('login')}
          </button>

          <div className="flex items-center justify-between text-sm">
            <Link to="/signup" className="text-emerald-600 hover:text-emerald-700 font-medium">
              {t('noAccount')}
            </Link>
            <button type="button" onClick={() => setLang(lang === 'es' ? 'en' : 'es')} className="flex items-center gap-1 text-gray-400 hover:text-gray-600">
              <Globe className="w-4 h-4" /> {lang === 'es' ? 'EN' : 'ES'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
