import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { Save, User, Building, Globe } from 'lucide-react'

export default function Settings() {
  const { t, lang, setLang } = useLanguage()
  const { profile, organization, updateProfile, isDemo } = useAuth()

  const [fullName, setFullName] = useState(profile?.full_name || '')
  const [saved, setSaved] = useState(false)

  async function handleSave() {
    await updateProfile({ full_name: fullName })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">{t('settingsTitle')}</h1>

      {/* Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-gray-400" />
          {t('profileSection')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
            <input
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
            <input
              value={profile?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'es' ? 'Rol' : 'Role'}</label>
            <input
              value={profile?.role || 'owner'}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm capitalize"
            />
          </div>
        </div>
      </div>

      {/* Organization */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-gray-400" />
          {t('orgSection')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('orgName')}</label>
            <input
              value={organization?.name || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'es' ? 'Plan' : 'Plan'}</label>
              <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm capitalize">
                {organization?.plan || 'trial'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'es' ? 'Productos máx.' : 'Max products'}</label>
              <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm">
                {organization?.max_products || 50}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'es' ? 'Usuarios máx.' : 'Max users'}</label>
              <div className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm">
                {organization?.max_users || 2}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Language */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-gray-400" />
          {lang === 'es' ? 'Idioma' : 'Language'}
        </h2>
        <div className="flex gap-3">
          <button
            onClick={() => setLang('es')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              lang === 'es' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Español
          </button>
          <button
            onClick={() => setLang('en')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              lang === 'en' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            English
          </button>
        </div>
      </div>

      {/* Save */}
      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition font-medium text-sm"
      >
        <Save className="w-4 h-4" />
        {saved ? (lang === 'es' ? 'Guardado!' : 'Saved!') : t('saveChanges')}
      </button>

      {isDemo && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          {lang === 'es'
            ? 'Modo demo — los cambios no se guardan. Conecta Supabase para persistir datos.'
            : 'Demo mode — changes are not saved. Connect Supabase to persist data.'}
        </div>
      )}
    </div>
  )
}
