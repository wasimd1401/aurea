import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { useInventory } from '@/hooks/useInventory'
import { Plus, AlertTriangle, X } from 'lucide-react'
import type { LossReason } from '@/lib/types'

const REASONS: LossReason[] = ['vencimiento', 'deterioro', 'robo', 'error_conteo', 'mal_almacenamiento', 'devolucion_proveedor', 'otro']

export default function Losses() {
  const { t, lang } = useLanguage()
  const { products, losses, metrics, addLoss } = useInventory()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    product_id: '',
    quantity: 0,
    reason: 'deterioro' as LossReason,
    responsible: '',
    preventable: false,
    notes: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addLoss(form)
    setForm({ product_id: '', quantity: 0, reason: 'deterioro', responsible: '', preventable: false, notes: '' })
    setShowForm(false)
  }

  const formatCLP = (n: number) => `$${Math.round(n).toLocaleString('es-CL')}`

  const lossesWithProduct = losses.map(l => ({
    ...l,
    product: products.find(p => p.id === l.product_id),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('navLoss')}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> {t('addLoss')}
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">{t('totalLoss')}</div>
          <div className="text-2xl font-bold text-red-600">{formatCLP(metrics.monthlyLoss)}</div>
          <div className="text-xs text-gray-400">{losses.length} {lang === 'es' ? 'registros' : 'records'}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">{t('preventableRate')}</div>
          <div className="text-2xl font-bold text-amber-600">{metrics.preventableRate.toFixed(0)}%</div>
          <div className="text-xs text-gray-400">{losses.filter(l => l.preventable).length} {lang === 'es' ? 'prevenibles' : 'preventable'}</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="text-sm text-gray-500 mb-1">{lang === 'es' ? 'vs Inventario' : 'vs Inventory'}</div>
          <div className={`text-2xl font-bold ${metrics.lossPercentage > 2 ? 'text-red-600' : 'text-emerald-600'}`}>
            {metrics.lossPercentage.toFixed(1)}%
          </div>
          <div className="text-xs text-gray-400">{t('lossTarget')}</div>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{t('addLoss')}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('navProducts')}</label>
                <select value={form.product_id} onChange={e => setForm(f => ({ ...f, product_id: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option value="">{lang === 'es' ? 'Seleccionar...' : 'Select...'}</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.current_stock} {p.unit})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('quantity')}</label>
                <input type="number" step="0.01" min="0" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: +e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('lossReason')}</label>
                <select value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value as LossReason }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  {REASONS.map(r => <option key={r} value={r}>{t(r)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('responsible')}</label>
                <input value={form.responsible} onChange={e => setForm(f => ({ ...f, responsible: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.preventable} onChange={e => setForm(f => ({ ...f, preventable: e.target.checked }))} className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm text-gray-700">{t('preventable')}</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('notes')}</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm">{t('cancel')}</button>
                <button type="submit" className="flex-1 py-2.5 bg-red-600 text-white rounded-lg font-medium text-sm hover:bg-red-700">{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Loss records */}
      {lossesWithProduct.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{lang === 'es' ? 'Sin mermas registradas' : 'No losses recorded'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lossesWithProduct.map(l => (
            <div key={l.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${l.preventable ? 'bg-amber-50' : 'bg-red-50'}`}>
                <AlertTriangle className={`w-5 h-5 ${l.preventable ? 'text-amber-500' : 'text-red-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{l.product?.name || 'Producto'}</span>
                  {l.preventable && (
                    <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">{t('preventable')}</span>
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {t(l.reason)} — {l.responsible} — {new Date(l.date).toLocaleDateString(lang === 'es' ? 'es-CL' : 'en-US')}
                </div>
                {l.notes && <div className="text-xs text-gray-500 mt-0.5">{l.notes}</div>}
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-red-600">{formatCLP(l.cost_impact)}</div>
                <div className="text-xs text-gray-400">{l.quantity} {l.product?.unit || ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
