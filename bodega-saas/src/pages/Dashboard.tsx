import { useLanguage } from '@/hooks/useLanguage'
import { useInventory } from '@/hooks/useInventory'
import {
  Package, DollarSign, Bell, TrendingDown,
  AlertTriangle, Clock, ArrowUpRight, ArrowDownRight,
} from 'lucide-react'

export default function Dashboard() {
  const { t, lang } = useLanguage()
  const { metrics, alerts, movements, products, batches, losses } = useInventory()

  const formatCLP = (n: number) => `$${Math.round(n).toLocaleString('es-CL')}`

  const kpis = [
    { label: t('totalProducts'), value: metrics.totalProducts, icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: t('inventoryValue'), value: formatCLP(metrics.totalInventoryValue), icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
    { label: t('activeAlerts'), value: metrics.activeAlerts, icon: Bell, color: 'bg-amber-50 text-amber-600' },
    { label: t('monthlyLoss'), value: formatCLP(metrics.monthlyLoss), icon: TrendingDown, color: 'bg-red-50 text-red-600', sub: `${metrics.lossPercentage.toFixed(1)}% — ${t('lossTarget')}` },
  ]

  // Near expiry products (7 days)
  const expiringBatches = batches.filter(b => {
    const days = Math.ceil((new Date(b.expiration_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return days >= 0 && days <= 7
  }).map(b => {
    const product = products.find(p => p.id === b.product_id)
    const days = Math.ceil((new Date(b.expiration_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    return { ...b, product, days }
  }).sort((a, b) => a.days - b.days)

  // Low stock products
  const lowStock = products.filter(p => p.current_stock <= p.min_stock)

  // Recent movements
  const recentMov = movements.slice(0, 5).map(m => ({
    ...m,
    product: products.find(p => p.id === m.product_id),
  }))

  // Loss by reason for mini chart
  const lossByReason = losses.reduce<Record<string, number>>((acc, l) => {
    acc[l.reason] = (acc[l.reason] || 0) + l.cost_impact
    return acc
  }, {})
  const maxLoss = Math.max(...Object.values(lossByReason), 1)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">{t('navDashboard')}</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map(kpi => (
          <div key={kpi.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-500">{kpi.label}</span>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            {kpi.sub && <div className="text-xs text-gray-400 mt-1">{kpi.sub}</div>}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Alerts */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-500" />
            {t('activeAlerts')} ({alerts.length})
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-sm text-gray-400">{lang === 'es' ? 'Sin alertas activas' : 'No active alerts'}</p>
            ) : (
              alerts.slice(0, 8).map(alert => (
                <div key={alert.id} className={`flex items-start gap-2 p-2 rounded-lg text-sm ${
                  alert.severity === 'critical' ? 'bg-red-50 text-red-700' :
                  alert.severity === 'high' ? 'bg-amber-50 text-amber-700' :
                  'bg-yellow-50 text-yellow-700'
                }`}>
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {alert.message}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Near expiry */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            {t('nearExpiry')} ({expiringBatches.length})
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {expiringBatches.length === 0 ? (
              <p className="text-sm text-gray-400">{lang === 'es' ? 'Sin productos por vencer' : 'No expiring products'}</p>
            ) : (
              expiringBatches.map(b => (
                <div key={b.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{b.product?.name}</div>
                    <div className="text-xs text-gray-400">{lang === 'es' ? 'Lote' : 'Lot'}: {b.lot_number}</div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    b.days <= 1 ? 'bg-red-100 text-red-700' :
                    b.days <= 3 ? 'bg-amber-100 text-amber-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {b.days}d
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-red-500" />
            {t('lowStock')} ({lowStock.length})
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {lowStock.length === 0 ? (
              <p className="text-sm text-gray-400">{lang === 'es' ? 'Todo el stock OK' : 'All stock OK'}</p>
            ) : (
              lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-400">{t('minStock')}: {p.min_stock} {p.unit}</div>
                  </div>
                  <span className="text-sm font-bold text-red-600">{p.current_stock} {p.unit}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent movements */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">{t('recentMovements')}</h2>
          <div className="space-y-3">
            {recentMov.length === 0 ? (
              <p className="text-sm text-gray-400">{t('noMovements')}</p>
            ) : (
              recentMov.map(m => (
                <div key={m.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    m.type === 'entrada' ? 'bg-emerald-50' : m.type === 'salida' ? 'bg-blue-50' : 'bg-red-50'
                  }`}>
                    {m.type === 'entrada' ? <ArrowDownRight className="w-4 h-4 text-emerald-600" /> : <ArrowUpRight className="w-4 h-4 text-red-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{m.product?.name || 'Producto'}</div>
                    <div className="text-xs text-gray-400">{t(m.type)} — {m.responsible}</div>
                  </div>
                  <span className={`text-sm font-semibold ${m.type === 'entrada' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {m.type === 'entrada' ? '+' : '-'}{m.quantity}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Loss by reason mini chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900 mb-4">{t('lossByReason')}</h2>
          <div className="space-y-3">
            {Object.keys(lossByReason).length === 0 ? (
              <p className="text-sm text-gray-400">{lang === 'es' ? 'Sin mermas registradas' : 'No losses recorded'}</p>
            ) : (
              Object.entries(lossByReason).sort((a, b) => b[1] - a[1]).map(([reason, amount]) => (
                <div key={reason}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">{t(reason)}</span>
                    <span className="font-medium text-gray-900">{formatCLP(amount)}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-red-400 h-2 rounded-full transition-all"
                      style={{ width: `${(amount / maxLoss) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
          {metrics.preventableRate > 0 && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
              {lang === 'es'
                ? `${metrics.preventableRate.toFixed(0)}% de las mermas son prevenibles`
                : `${metrics.preventableRate.toFixed(0)}% of losses are preventable`}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
