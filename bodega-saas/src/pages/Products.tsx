import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { useInventory } from '@/hooks/useInventory'
import CameraScanner from '@/components/CameraScanner'
import { Plus, Search, Camera, Trash2, X, Package } from 'lucide-react'
import type { ProductCategory, StorageZone, ProductUnit } from '@/lib/types'

const CATEGORIES: ProductCategory[] = ['carnes', 'pescados', 'lacteos', 'verduras', 'frutas', 'abarrotes', 'bebidas', 'congelados', 'condimentos', 'limpieza']
const ZONES: StorageZone[] = ['refrigerado', 'congelado', 'seco', 'ambiente']
const UNITS: ProductUnit[] = ['kg', 'lt', 'unidad', 'caja', 'botella', 'bolsa']

export default function Products() {
  const { t } = useLanguage()
  const { products, addProduct, deleteProduct } = useInventory()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [form, setForm] = useState({
    name: '', sku: '', category: 'abarrotes' as ProductCategory,
    unit: 'kg' as ProductUnit, storage_zone: 'ambiente' as StorageZone,
    current_stock: 0, min_stock: 0, max_stock: 100,
    cost_per_unit: 0, supplier: '', shelf_life_days: 7,
  })

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  function resetForm() {
    setForm({
      name: '', sku: '', category: 'abarrotes', unit: 'kg', storage_zone: 'ambiente',
      current_stock: 0, min_stock: 0, max_stock: 100, cost_per_unit: 0, supplier: '', shelf_life_days: 7,
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await addProduct(form)
    resetForm()
    setShowForm(false)
  }

  function handleCameraResult(result: { name: string; category: string; unit: string; storageZone: string; shelfLifeDays: number }) {
    setForm(prev => ({
      ...prev,
      name: result.name,
      category: (CATEGORIES.includes(result.category as ProductCategory) ? result.category : 'abarrotes') as ProductCategory,
      unit: (UNITS.includes(result.unit as ProductUnit) ? result.unit : 'kg') as ProductUnit,
      storage_zone: (ZONES.includes(result.storageZone as StorageZone) ? result.storageZone : 'ambiente') as StorageZone,
      shelf_life_days: result.shelfLifeDays,
      sku: `${result.category?.slice(0, 3).toUpperCase() || 'PRD'}-${String(products.length + 1).padStart(3, '0')}`,
    }))
    setShowCamera(false)
    setShowForm(true)
  }

  const formatCLP = (n: number) => `$${Math.round(n).toLocaleString('es-CL')}`

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">{t('navProducts')}</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCamera(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
          >
            <Camera className="w-4 h-4" /> {t('scanWithCamera')}
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(true) }}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> {t('addProduct')}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={t('searchProducts')}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
        />
      </div>

      {/* Product form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{t('addProduct')}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('productName')}</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('sku')}</label>
                  <input value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('category')}</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ProductCategory }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                    {CATEGORIES.map(c => <option key={c} value={c}>{t(c)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('unit')}</label>
                  <select value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value as ProductUnit }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('storageZone')}</label>
                  <select value={form.storage_zone} onChange={e => setForm(f => ({ ...f, storage_zone: e.target.value as StorageZone }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm">
                    {ZONES.map(z => <option key={z} value={z}>{t(z)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('currentStock')}</label>
                  <input type="number" value={form.current_stock} onChange={e => setForm(f => ({ ...f, current_stock: +e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('minStock')}</label>
                  <input type="number" value={form.min_stock} onChange={e => setForm(f => ({ ...f, min_stock: +e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('maxStock')}</label>
                  <input type="number" value={form.max_stock} onChange={e => setForm(f => ({ ...f, max_stock: +e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('costPerUnit')}</label>
                  <input type="number" value={form.cost_per_unit} onChange={e => setForm(f => ({ ...f, cost_per_unit: +e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('supplier')}</label>
                  <input value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{t('shelfLife')}</label>
                  <input type="number" value={form.shelf_life_days} onChange={e => setForm(f => ({ ...f, shelf_life_days: +e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50">{t('cancel')}</button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 text-white rounded-lg font-medium text-sm hover:bg-emerald-700">{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Camera scanner */}
      {showCamera && (
        <CameraScanner
          onClose={() => setShowCamera(false)}
          onResult={handleCameraResult}
        />
      )}

      {/* Products table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">{t('noProducts')}</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-500">{t('productName')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">{t('sku')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">{t('category')}</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">{t('storageZone')}</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">{t('currentStock')}</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">{t('costPerUnit')}</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">{t(p.category)}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{t(p.storage_zone)}</td>
                  <td className={`px-4 py-3 text-right font-semibold ${p.current_stock <= p.min_stock ? 'text-red-600' : 'text-gray-900'}`}>
                    {p.current_stock} {p.unit}
                  </td>
                  <td className="px-4 py-3 text-right text-gray-600">{formatCLP(p.cost_per_unit)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
