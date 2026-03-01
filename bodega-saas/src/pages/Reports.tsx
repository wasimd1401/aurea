import { useState, useEffect } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { useInventory } from '@/hooks/useInventory'
import { getInventoryRecommendations } from '@/lib/nvidia-ai'
import { BarChart3, Lightbulb, Loader2 } from 'lucide-react'

export default function Reports() {
  const { t, lang } = useLanguage()
  const { products, losses, metrics } = useInventory()
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [loadingRecs, setLoadingRecs] = useState(false)

  const formatCLP = (n: number) => `$${Math.round(n).toLocaleString('es-CL')}`

  // Loss by reason
  const lossByReason = losses.reduce<Record<string, number>>((acc, l) => {
    acc[l.reason] = (acc[l.reason] || 0) + l.cost_impact
    return acc
  }, {})
  const maxLossReason = Math.max(...Object.values(lossByReason), 1)

  // Loss by category
  const lossByCategory = losses.reduce<Record<string, number>>((acc, l) => {
    const product = products.find(p => p.id === l.product_id)
    const cat = product?.category || 'otro'
    acc[cat] = (acc[cat] || 0) + l.cost_impact
    return acc
  }, {})
  const maxLossCategory = Math.max(...Object.values(lossByCategory), 1)

  // Top loss products
  const lossByProduct = losses.reduce<Record<string, { name: string; cost: number; count: number }>>((acc, l) => {
    const product = products.find(p => p.id === l.product_id)
    const name = product?.name || 'Producto'
    if (!acc[l.product_id]) acc[l.product_id] = { name, cost: 0, count: 0 }
    acc[l.product_id].cost += l.cost_impact
    acc[l.product_id].count++
    return acc
  }, {})
  const topLossProducts = Object.values(lossByProduct).sort((a, b) => b.cost - a.cost).slice(0, 5)

  // Load recommendations
  async function loadRecommendations() {
    setLoadingRecs(true)
    try {
      const recs = await getInventoryRecommendations({
        totalProducts: metrics.totalProducts,
        lossPercentage: metrics.lossPercentage,
        preventableRate: metrics.preventableRate,
        topLossReasons: Object.keys(lossByReason).sort((a, b) => (lossByReason[b] || 0) - (lossByReason[a] || 0)),
        expiringCount: metrics.expiringCount,
        lowStockCount: metrics.lowStockCount,
        language: lang,
      })
      setRecommendations(recs)
    } catch {
      setRecommendations([
        lang === 'es'
          ? 'No se pudieron cargar las recomendaciones. Verifica tu conexión.'
          : 'Could not load recommendations. Check your connection.',
      ])
    }
    setLoadingRecs(false)
  }

  useEffect(() => {
    loadRecommendations()
  }, [lang])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('navReports')}</h1>

      {/* Loss vs Inventory */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">{t('lossVsInventory')}</h2>
        <div className="flex items-end gap-4 h-32">
          <div className="flex-1 text-center">
            <div className="bg-emerald-100 rounded-t-lg mx-auto max-w-24" style={{ height: '100%' }} />
            <div className="text-xs text-gray-500 mt-2">{lang === 'es' ? 'Inventario' : 'Inventory'}</div>
            <div className="text-sm font-semibold text-gray-900">{formatCLP(metrics.totalInventoryValue)}</div>
          </div>
          <div className="flex-1 text-center">
            <div
              className="bg-red-100 rounded-t-lg mx-auto max-w-24"
              style={{ height: `${Math.max(5, Math.min(100, metrics.lossPercentage * 10))}%` }}
            />
            <div className="text-xs text-gray-500 mt-2">{lang === 'es' ? 'Mermas' : 'Losses'}</div>
            <div className="text-sm font-semibold text-red-600">{formatCLP(metrics.monthlyLoss)} ({metrics.lossPercentage.toFixed(1)}%)</div>
          </div>
          <div className="flex-1 text-center">
            <div className="bg-amber-100 rounded-t-lg mx-auto max-w-24 border-2 border-dashed border-amber-400" style={{ height: '20%' }} />
            <div className="text-xs text-gray-500 mt-2">{lang === 'es' ? 'Objetivo' : 'Target'}</div>
            <div className="text-sm font-semibold text-amber-600">2%</div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Loss by reason */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">{t('lossByReason')}</h2>
          <div className="space-y-3">
            {Object.keys(lossByReason).length === 0 ? (
              <p className="text-sm text-gray-400">{lang === 'es' ? 'Sin datos' : 'No data'}</p>
            ) : (
              Object.entries(lossByReason).sort((a, b) => b[1] - a[1]).map(([reason, amount]) => (
                <div key={reason}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{t(reason)}</span>
                    <span className="font-medium text-gray-900">{formatCLP(amount)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-red-400 h-3 rounded-full" style={{ width: `${(amount / maxLossReason) * 100}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Loss by category */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">{t('lossByCategory')}</h2>
          <div className="space-y-3">
            {Object.keys(lossByCategory).length === 0 ? (
              <p className="text-sm text-gray-400">{lang === 'es' ? 'Sin datos' : 'No data'}</p>
            ) : (
              Object.entries(lossByCategory).sort((a, b) => b[1] - a[1]).map(([cat, amount]) => (
                <div key={cat}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{t(cat)}</span>
                    <span className="font-medium text-gray-900">{formatCLP(amount)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div className="bg-blue-400 h-3 rounded-full" style={{ width: `${(amount / maxLossCategory) * 100}%` }} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Top loss products */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">{t('topLossProducts')}</h2>
        {topLossProducts.length === 0 ? (
          <p className="text-sm text-gray-400">{lang === 'es' ? 'Sin datos' : 'No data'}</p>
        ) : (
          <div className="space-y-3">
            {topLossProducts.map((p, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center text-sm font-bold">#{i + 1}</div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.count} {lang === 'es' ? 'incidentes' : 'incidents'}</div>
                </div>
                <div className="text-sm font-bold text-red-600">{formatCLP(p.cost)}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Recommendations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            {t('recommendations')}
          </h2>
          <button
            onClick={loadRecommendations}
            disabled={loadingRecs}
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium disabled:opacity-50"
          >
            {loadingRecs ? <Loader2 className="w-4 h-4 animate-spin" /> : (lang === 'es' ? 'Actualizar' : 'Refresh')}
          </button>
        </div>
        <div className="space-y-3">
          {loadingRecs ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              {lang === 'es' ? 'Generando recomendaciones...' : 'Generating recommendations...'}
            </div>
          ) : recommendations.length === 0 ? (
            <p className="text-sm text-gray-400">{lang === 'es' ? 'Sin recomendaciones' : 'No recommendations'}</p>
          ) : (
            recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg">
                <span className="text-amber-500 font-bold text-sm mt-0.5">{i + 1}.</span>
                <p className="text-sm text-amber-900">{rec}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
