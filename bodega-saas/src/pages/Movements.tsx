import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { useInventory } from '@/hooks/useInventory'
import { Plus, ArrowUpRight, ArrowDownRight, X } from 'lucide-react'
import type { MovementType } from '@/lib/types'

const TYPES: MovementType[] = ['entrada', 'salida', 'ajuste', 'merma']

export default function Movements() {
  const { t, lang } = useLanguage()
  const { products, movements, addMovement } = useInventory()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    product_id: '',
    type: 'entrada' as MovementType,
    quantity: 0,
    responsible: '',
    notes: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addMovement(form)
    setForm({ product_id: '', type: 'entrada', quantity: 0, responsible: '', notes: '' })
    setShowForm(false)
  }

  const movsWithProduct = movements.map(m => ({
    ...m,
    product: products.find(p => p.id === m.product_id),
  }))

  const formatCLP = (n: number) => `$${Math.round(n).toLocaleString('es-CL')}`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('navMovements')}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> {t('addMovement')}
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{t('addMovement')}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('movementType')}</label>
                <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as MovementType }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  {TYPES.map(type => <option key={type} value={type}>{t(type)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('quantity')}</label>
                <input type="number" step="0.01" min="0" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: +e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('responsible')}</label>
                <input value={form.responsible} onChange={e => setForm(f => ({ ...f, responsible: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('notes')}</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm">{t('cancel')}</button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700">{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movements list */}
      {movsWithProduct.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">{t('noMovements')}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {movsWithProduct.map(m => {
            const isIn = m.type === 'entrada'
            return (
              <div key={m.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isIn ? 'bg-emerald-50' : m.type === 'merma' ? 'bg-red-50' : 'bg-blue-50'
                }`}>
                  {isIn ? <ArrowDownRight className="w-5 h-5 text-emerald-600" /> : <ArrowUpRight className="w-5 h-5 text-red-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">{m.product?.name || 'Producto'}</div>
                  <div className="text-xs text-gray-400">
                    {t(m.type)} — {m.responsible} — {new Date(m.date).toLocaleDateString(lang === 'es' ? 'es-CL' : 'en-US')}
                  </div>
                  {m.notes && <div className="text-xs text-gray-500 mt-0.5">{m.notes}</div>}
                </div>
                <div className={`text-lg font-bold ${isIn ? 'text-emerald-600' : 'text-red-600'}`}>
                  {isIn ? '+' : '-'}{m.quantity} {m.product?.unit || ''}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
