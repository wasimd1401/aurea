import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { useInventory } from '@/hooks/useInventory'
import { Plus, Clock, X } from 'lucide-react'

export default function Expiration() {
  const { t, lang } = useLanguage()
  const { products, batches, addBatch } = useInventory()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    product_id: '',
    lot_number: '',
    quantity: 0,
    expiration_date: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addBatch(form)
    setForm({ product_id: '', lot_number: '', quantity: 0, expiration_date: '' })
    setShowForm(false)
  }

  const now = new Date()
  const batchesWithInfo = batches.map(b => {
    const product = products.find(p => p.id === b.product_id)
    const exp = new Date(b.expiration_date)
    const days = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    let status: 'expired' | 'critical' | 'warning' | 'ok' = 'ok'
    if (days < 0) status = 'expired'
    else if (days <= 2) status = 'critical'
    else if (days <= 7) status = 'warning'
    return { ...b, product, days, status }
  }).sort((a, b) => a.days - b.days)

  const statusColors = {
    expired: 'bg-red-100 text-red-800 border-red-200',
    critical: 'bg-red-50 text-red-700 border-red-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    ok: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  }

  const statusBadge = {
    expired: 'bg-red-500 text-white',
    critical: 'bg-red-400 text-white',
    warning: 'bg-amber-400 text-white',
    ok: 'bg-emerald-400 text-white',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('navExpiry')}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> {t('addBatch')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {(['expired', 'critical', 'warning', 'ok'] as const).map(status => {
          const count = batchesWithInfo.filter(b => b.status === status).length
          return (
            <div key={status} className={`rounded-xl border p-4 ${statusColors[status]}`}>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm font-medium">{t(status)}</div>
            </div>
          )
        })}
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{t('addBatch')}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('navProducts')}</label>
                <select value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">{lang === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('lotNumber')}</label>
                <input value={form.lot_number} onChange={e => setForm(f => ({ ...f, lot_number: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="L-2024-XXX" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('quantity')}</label>
                <input type="number" step="0.01" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: +e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('expirationDate')}</label>
                <input type="date" value={form.expiration_date} onChange={e => setForm(f => ({ ...f, expiration_date: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm">{t('cancel')}</button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700">{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batches list */}
      {batchesWithInfo.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{lang === 'es' ? 'No hay lotes registrados' : 'No batches recorded'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {batchesWithInfo.map(b => (
            <div key={b.id} className={`rounded-xl border p-4 flex items-center gap-4 ${statusColors[b.status]}`}>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{b.product?.name || 'Producto'}</div>
                <div className="text-xs opacity-75">
                  {t('lotNumber')}: {b.lot_number} — {b.quantity} {b.product?.unit || ''}
                </div>
              </div>
              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${statusBadge[b.status]}`}>
                  {b.status === 'expired'
                    ? t('expired')
                    : `${b.days} ${lang === 'es' ? 'días' : 'days'}`}
                </span>
                <div className="text-xs opacity-75 mt-1">
                  {new Date(b.expiration_date).toLocaleDateString(lang === 'es' ? 'es-CL' : 'en-US')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
