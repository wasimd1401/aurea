import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  Warehouse,
  Package,
  ArrowRightLeft,
  CalendarClock,
  TrendingDown,
  BarChart3,
  Plus,
  Search,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Clock,
  ShieldAlert,
  Thermometer,
  Trash2,
  ChevronDown,
  X,
  Camera,
} from 'lucide-react';
import { CONTENT } from '../constants';
import CameraScanner from './CameraScanner';
import {
  Language,
  BodegaProduct,
  StockBatch,
  StockMovement,
  LossRecord,
  BodegaAlert,
  BodegaView,
  ProductCategory,
  StorageZone,
  MovementType,
  LossReason,
} from '../types';

interface BodegaInventoryProps {
  lang: Language;
}

// ── Helpers ──

const generateId = () => Math.random().toString(36).substring(2, 11);

const formatCLP = (amount: number) =>
  '$' + amount.toLocaleString('es-CL');

const daysUntil = (dateStr: string) => {
  const target = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
};

const todayStr = () => new Date().toISOString().slice(0, 10);

// ── Sample Data for Chilean Restaurant ──

const SAMPLE_PRODUCTS: BodegaProduct[] = [
  { id: 'p1', name: 'Lomo vetado', sku: 'CAR-001', category: 'carnes', unit: 'kg', storageZone: 'refrigerado', minStock: 10, maxStock: 50, currentStock: 8, costPerUnit: 12500, supplier: 'Frigorífico Sur', shelfLifeDays: 5, createdAt: '2026-01-15' },
  { id: 'p2', name: 'Salmón fresco', sku: 'PES-001', category: 'pescados', unit: 'kg', storageZone: 'refrigerado', minStock: 5, maxStock: 20, currentStock: 12, costPerUnit: 15800, supplier: 'Pesquera Austral', shelfLifeDays: 3, createdAt: '2026-01-15' },
  { id: 'p3', name: 'Queso mantecoso', sku: 'LAC-001', category: 'lacteos', unit: 'kg', storageZone: 'refrigerado', minStock: 3, maxStock: 15, currentStock: 7, costPerUnit: 8900, supplier: 'Lácteos del Campo', shelfLifeDays: 15, createdAt: '2026-01-20' },
  { id: 'p4', name: 'Tomate limachino', sku: 'VER-001', category: 'verduras', unit: 'kg', storageZone: 'refrigerado', minStock: 8, maxStock: 30, currentStock: 22, costPerUnit: 1800, supplier: 'Hortaliza Central', shelfLifeDays: 7, createdAt: '2026-01-20' },
  { id: 'p5', name: 'Palta Hass', sku: 'FRU-001', category: 'frutas', unit: 'kg', storageZone: 'ambiente', minStock: 5, maxStock: 20, currentStock: 4, costPerUnit: 4500, supplier: 'Agrícola Valle', shelfLifeDays: 5, createdAt: '2026-02-01' },
  { id: 'p6', name: 'Aceite de oliva extra virgen', sku: 'ABA-001', category: 'abarrotes', unit: 'lt', storageZone: 'seco', minStock: 10, maxStock: 40, currentStock: 25, costPerUnit: 6200, supplier: 'Oleícola Chile', shelfLifeDays: 365, createdAt: '2026-01-10' },
  { id: 'p7', name: 'Vino Carménère reserva', sku: 'BEB-001', category: 'bebidas', unit: 'botella', storageZone: 'seco', minStock: 12, maxStock: 60, currentStock: 35, costPerUnit: 5500, supplier: 'Viña Colchagua', shelfLifeDays: 730, createdAt: '2026-01-10' },
  { id: 'p8', name: 'Congrio dorado congelado', sku: 'CON-001', category: 'congelados', unit: 'kg', storageZone: 'congelado', minStock: 8, maxStock: 30, currentStock: 18, costPerUnit: 11200, supplier: 'Pesquera Austral', shelfLifeDays: 90, createdAt: '2026-02-01' },
  { id: 'p9', name: 'Merkén ahumado', sku: 'COD-001', category: 'condimentos', unit: 'kg', storageZone: 'seco', minStock: 2, maxStock: 10, currentStock: 6, costPerUnit: 18000, supplier: 'Especias Araucanía', shelfLifeDays: 180, createdAt: '2026-01-25' },
  { id: 'p10', name: 'Crema de leche', sku: 'LAC-002', category: 'lacteos', unit: 'lt', storageZone: 'refrigerado', minStock: 5, maxStock: 20, currentStock: 3, costPerUnit: 2800, supplier: 'Lácteos del Campo', shelfLifeDays: 10, createdAt: '2026-02-10' },
];

const SAMPLE_BATCHES: StockBatch[] = [
  { id: 'b1', productId: 'p1', quantity: 8, expirationDate: '2026-03-01', receivedDate: '2026-02-25', lotNumber: 'LOT-2602-A' },
  { id: 'b2', productId: 'p2', quantity: 12, expirationDate: '2026-02-28', receivedDate: '2026-02-25', lotNumber: 'LOT-2602-B' },
  { id: 'b3', productId: 'p3', quantity: 7, expirationDate: '2026-03-10', receivedDate: '2026-02-23', lotNumber: 'LOT-2602-C' },
  { id: 'b4', productId: 'p4', quantity: 22, expirationDate: '2026-03-04', receivedDate: '2026-02-25', lotNumber: 'LOT-2602-D' },
  { id: 'b5', productId: 'p5', quantity: 4, expirationDate: '2026-03-02', receivedDate: '2026-02-25', lotNumber: 'LOT-2602-E' },
  { id: 'b6', productId: 'p10', quantity: 3, expirationDate: '2026-03-05', receivedDate: '2026-02-23', lotNumber: 'LOT-2602-F' },
];

const SAMPLE_MOVEMENTS: StockMovement[] = [
  { id: 'm1', productId: 'p1', productName: 'Lomo vetado', type: 'entrada', quantity: 15, date: '2026-02-25', responsable: 'Carlos M.', notes: 'Recepción semanal' },
  { id: 'm2', productId: 'p1', productName: 'Lomo vetado', type: 'salida', quantity: 7, date: '2026-02-26', responsable: 'Chef Andrés', notes: 'Servicio almuerzo' },
  { id: 'm3', productId: 'p2', productName: 'Salmón fresco', type: 'entrada', quantity: 15, date: '2026-02-25', responsable: 'Carlos M.', notes: 'Pedido especial' },
  { id: 'm4', productId: 'p2', productName: 'Salmón fresco', type: 'salida', quantity: 3, date: '2026-02-26', responsable: 'Chef Andrés', notes: 'Servicio cena' },
  { id: 'm5', productId: 'p4', productName: 'Tomate limachino', type: 'merma', quantity: 2, date: '2026-02-26', responsable: 'Juana R.', notes: 'Deterioro por golpe en transporte' },
  { id: 'm6', productId: 'p10', productName: 'Crema de leche', type: 'salida', quantity: 2, date: '2026-02-27', responsable: 'Pastelería', notes: 'Producción postres' },
];

const SAMPLE_LOSSES: LossRecord[] = [
  { id: 'l1', productId: 'p4', productName: 'Tomate limachino', quantity: 2, reason: 'deterioro', costImpact: 3600, date: '2026-02-26', responsable: 'Juana R.', notes: 'Golpeados en transporte', preventable: true },
  { id: 'l2', productId: 'p2', productName: 'Salmón fresco', quantity: 1.5, reason: 'vencimiento', costImpact: 23700, date: '2026-02-24', responsable: 'Carlos M.', notes: 'No se usó antes de expirar', preventable: true },
  { id: 'l3', productId: 'p5', productName: 'Palta Hass', quantity: 3, reason: 'mal_almacenamiento', costImpact: 13500, date: '2026-02-23', responsable: 'Turno noche', notes: 'Quedaron fuera del refrigerador', preventable: true },
  { id: 'l4', productId: 'p10', productName: 'Crema de leche', quantity: 2, reason: 'vencimiento', costImpact: 5600, date: '2026-02-20', responsable: 'Carlos M.', notes: 'Bajo rotación esta semana', preventable: true },
  { id: 'l5', productId: 'p9', productName: 'Merkén ahumado', quantity: 0.5, reason: 'error_conteo', costImpact: 9000, date: '2026-02-18', responsable: 'Inventario', notes: 'Diferencia en auditoría', preventable: false },
];

// ── Component ──

const BodegaInventory: React.FC<BodegaInventoryProps> = ({ lang }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });
  const t = (CONTENT[lang] as any).bodega;

  const [activeView, setActiveView] = useState<BodegaView>('dashboard');
  const [products, setProducts] = useState<BodegaProduct[]>(SAMPLE_PRODUCTS);
  const [batches, setBatches] = useState<StockBatch[]>(SAMPLE_BATCHES);
  const [movements, setMovements] = useState<StockMovement[]>(SAMPLE_MOVEMENTS);
  const [losses, setLosses] = useState<LossRecord[]>(SAMPLE_LOSSES);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showMovementForm, setShowMovementForm] = useState(false);
  const [showLossForm, setShowLossForm] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const [newProduct, setNewProduct] = useState<Partial<BodegaProduct>>({
    category: 'carnes',
    storageZone: 'refrigerado',
    unit: 'kg',
  });
  const [newMovement, setNewMovement] = useState<Partial<StockMovement>>({
    type: 'entrada',
    date: todayStr(),
  });
  const [newLoss, setNewLoss] = useState<Partial<LossRecord>>({
    reason: 'vencimiento',
    preventable: true,
    date: todayStr(),
  });

  // ── Computed Values ──

  const alerts = useMemo<BodegaAlert[]>(() => {
    const result: BodegaAlert[] = [];

    products.forEach((p) => {
      if (p.currentStock <= p.minStock) {
        result.push({
          id: `alert-low-${p.id}`,
          level: p.currentStock === 0 ? 'critico' : 'advertencia',
          message: `${p.name}: ${p.currentStock} ${p.unit} — ${t.alerts.lowStock}`,
          productId: p.id,
          productName: p.name,
          date: todayStr(),
          dismissed: false,
        });
      }
    });

    batches.forEach((b) => {
      const days = daysUntil(b.expirationDate);
      const product = products.find((p) => p.id === b.productId);
      if (!product) return;
      if (days < 0) {
        result.push({
          id: `alert-exp-${b.id}`,
          level: 'critico',
          message: `${product.name} (${b.lotNumber}): ${t.alerts.expired}`,
          productId: product.id,
          productName: product.name,
          date: todayStr(),
          dismissed: false,
        });
      } else if (days <= 3) {
        result.push({
          id: `alert-exp-${b.id}`,
          level: 'critico',
          message: `${product.name} (${b.lotNumber}): ${days}d — ${t.alerts.nearExpiry}`,
          productId: product.id,
          productName: product.name,
          date: todayStr(),
          dismissed: false,
        });
      } else if (days <= 7) {
        result.push({
          id: `alert-exp-${b.id}`,
          level: 'advertencia',
          message: `${product.name} (${b.lotNumber}): ${days}d — ${t.alerts.nearExpiry}`,
          productId: product.id,
          productName: product.name,
          date: todayStr(),
          dismissed: false,
        });
      }
    });

    return result.sort((a, b) => {
      const order = { critico: 0, advertencia: 1, info: 2 };
      return order[a.level] - order[b.level];
    });
  }, [products, batches, t]);

  const totalInventoryValue = useMemo(
    () => products.reduce((sum, p) => sum + p.currentStock * p.costPerUnit, 0),
    [products]
  );

  const monthlyLoss = useMemo(
    () => losses.reduce((sum, l) => sum + l.costImpact, 0),
    [losses]
  );

  const lossPercentage = useMemo(
    () => (totalInventoryValue > 0 ? ((monthlyLoss / totalInventoryValue) * 100).toFixed(1) : '0'),
    [monthlyLoss, totalInventoryValue]
  );

  const preventableRate = useMemo(() => {
    if (losses.length === 0) return '0';
    const preventable = losses.filter((l) => l.preventable).length;
    return ((preventable / losses.length) * 100).toFixed(0);
  }, [losses]);

  const lowStockProducts = useMemo(
    () => products.filter((p) => p.currentStock <= p.minStock),
    [products]
  );

  const expiringBatches = useMemo(() => {
    return batches
      .map((b) => ({
        ...b,
        product: products.find((p) => p.id === b.productId),
        daysLeft: daysUntil(b.expirationDate),
      }))
      .filter((b) => b.daysLeft <= 7)
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [batches, products]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q)
    );
  }, [products, searchQuery]);

  const lossByReason = useMemo(() => {
    const map: Record<string, number> = {};
    losses.forEach((l) => {
      map[l.reason] = (map[l.reason] || 0) + l.costImpact;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [losses]);

  const lossByCategory = useMemo(() => {
    const map: Record<string, number> = {};
    losses.forEach((l) => {
      const prod = products.find((p) => p.id === l.productId);
      if (prod) {
        map[prod.category] = (map[prod.category] || 0) + l.costImpact;
      }
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [losses, products]);

  // ── Actions ──

  const addProduct = useCallback(() => {
    if (!newProduct.name || !newProduct.sku) return;
    const product: BodegaProduct = {
      id: generateId(),
      name: newProduct.name || '',
      sku: newProduct.sku || '',
      category: (newProduct.category as ProductCategory) || 'abarrotes',
      unit: newProduct.unit || 'kg',
      storageZone: (newProduct.storageZone as StorageZone) || 'ambiente',
      minStock: newProduct.minStock || 0,
      maxStock: newProduct.maxStock || 100,
      currentStock: newProduct.currentStock || 0,
      costPerUnit: newProduct.costPerUnit || 0,
      supplier: newProduct.supplier || '',
      shelfLifeDays: newProduct.shelfLifeDays || 30,
      createdAt: todayStr(),
    };
    setProducts((prev) => [...prev, product]);
    setNewProduct({ category: 'carnes', storageZone: 'refrigerado', unit: 'kg' });
    setShowProductForm(false);
  }, [newProduct]);

  const addMovement = useCallback(() => {
    if (!newMovement.productId || !newMovement.quantity) return;
    const product = products.find((p) => p.id === newMovement.productId);
    if (!product) return;

    const movement: StockMovement = {
      id: generateId(),
      productId: newMovement.productId,
      productName: product.name,
      type: (newMovement.type as MovementType) || 'entrada',
      quantity: newMovement.quantity || 0,
      date: newMovement.date || todayStr(),
      responsable: newMovement.responsable || '',
      notes: newMovement.notes || '',
    };

    setMovements((prev) => [movement, ...prev]);

    // Update stock
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id !== movement.productId) return p;
        let newStock = p.currentStock;
        if (movement.type === 'entrada') newStock += movement.quantity;
        else if (movement.type === 'salida' || movement.type === 'merma') newStock -= movement.quantity;
        else newStock = movement.quantity; // ajuste = set absolute
        return { ...p, currentStock: Math.max(0, newStock) };
      })
    );

    setNewMovement({ type: 'entrada', date: todayStr() });
    setShowMovementForm(false);
  }, [newMovement, products]);

  const addLoss = useCallback(() => {
    if (!newLoss.productId || !newLoss.quantity) return;
    const product = products.find((p) => p.id === newLoss.productId);
    if (!product) return;

    const loss: LossRecord = {
      id: generateId(),
      productId: newLoss.productId,
      productName: product.name,
      quantity: newLoss.quantity || 0,
      reason: (newLoss.reason as LossReason) || 'otro',
      costImpact: (newLoss.quantity || 0) * product.costPerUnit,
      date: newLoss.date || todayStr(),
      responsable: newLoss.responsable || '',
      notes: newLoss.notes || '',
      preventable: newLoss.preventable ?? true,
    };

    setLosses((prev) => [loss, ...prev]);

    // Also register a merma movement
    const movement: StockMovement = {
      id: generateId(),
      productId: product.id,
      productName: product.name,
      type: 'merma',
      quantity: loss.quantity,
      date: loss.date,
      responsable: loss.responsable,
      notes: `Merma: ${t.losses.reasons[loss.reason as keyof typeof t.losses.reasons]} — ${loss.notes}`,
    };
    setMovements((prev) => [movement, ...prev]);

    // Update stock
    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, currentStock: Math.max(0, p.currentStock - loss.quantity) }
          : p
      )
    );

    setNewLoss({ reason: 'vencimiento', preventable: true, date: todayStr() });
    setShowLossForm(false);
  }, [newLoss, products, t]);

  const deleteProduct = useCallback((id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleCameraProductIdentified = useCallback((product: Partial<BodegaProduct>) => {
    setNewProduct({ ...newProduct, ...product });
    setShowCamera(false);
    setShowProductForm(true);
  }, [newProduct]);

  const handleCameraProductMatched = useCallback((productId: string) => {
    setShowCamera(false);
    setNewMovement({ ...newMovement, productId, type: 'entrada' });
    setShowMovementForm(true);
    setActiveView('movimientos');
  }, [newMovement]);

  // ── Sub-components ──

  const viewButtons: { key: BodegaView; icon: React.ReactNode }[] = [
    { key: 'dashboard', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'productos', icon: <Package className="w-4 h-4" /> },
    { key: 'movimientos', icon: <ArrowRightLeft className="w-4 h-4" /> },
    { key: 'vencimientos', icon: <CalendarClock className="w-4 h-4" /> },
    { key: 'mermas', icon: <TrendingDown className="w-4 h-4" /> },
    { key: 'reportes', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  // ── Shared Styles ──

  const inputClass = 'w-full bg-transparent border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-clay placeholder-gray-500';
  const selectClass = 'w-full bg-austral-dark border border-white/10 p-3 text-sm text-white focus:outline-none focus:border-austral-clay';
  const labelClass = 'block text-xs uppercase tracking-wider font-bold mb-2 text-austral-clay';
  const cardClass = 'bg-white/5 border border-white/10 p-6';
  const btnPrimary = 'bg-austral-clay text-white py-2.5 px-5 text-sm font-medium hover:bg-austral-clay/80 transition-all flex items-center gap-2';
  const btnSecondary = 'border border-white/20 text-white py-2.5 px-5 text-sm hover:bg-white/5 transition-all flex items-center gap-2';

  // ── Render: Dashboard ──

  const renderDashboard = () => (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{t.dashboard.totalProducts}</p>
          <p className="text-3xl font-serif text-white">{products.length}</p>
        </div>
        <div className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{t.dashboard.totalValue}</p>
          <p className="text-3xl font-serif text-white">{formatCLP(totalInventoryValue)}</p>
        </div>
        <div className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{t.dashboard.activeAlerts}</p>
          <p className="text-3xl font-serif text-red-400">{alerts.length}</p>
        </div>
        <div className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{t.dashboard.monthlyLoss}</p>
          <p className="text-3xl font-serif text-red-400">{formatCLP(monthlyLoss)}</p>
          <p className="text-xs text-gray-500 mt-1">{lossPercentage}% — {t.dashboard.lossTarget}</p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <p className="text-xs uppercase tracking-wider text-red-400 font-bold">{t.dashboard.activeAlerts}</p>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`flex items-center gap-3 p-3 text-sm ${
                  alert.level === 'critico'
                    ? 'bg-red-500/10 border border-red-500/20 text-red-300'
                    : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-300'
                }`}
              >
                {alert.level === 'critico' ? (
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                )}
                <span>{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Near Expiry */}
        <div className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-austral-clay font-bold mb-4">
            {t.dashboard.nearExpiry}
          </p>
          {expiringBatches.length > 0 ? (
            <div className="space-y-3">
              {expiringBatches.slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-white font-medium">{b.product?.name}</p>
                    <p className="text-xs text-gray-500">{b.lotNumber} · {b.quantity} {b.product?.unit}</p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 ${
                      b.daysLeft <= 0
                        ? 'bg-red-500/20 text-red-300'
                        : b.daysLeft <= 2
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}
                  >
                    {b.daysLeft <= 0 ? t.expiry.expired : `${b.daysLeft}d`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">{t.expiry.noExpiry}</p>
          )}
        </div>

        {/* Low Stock */}
        <div className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-austral-clay font-bold mb-4">
            {t.dashboard.lowStock}
          </p>
          {lowStockProducts.length > 0 ? (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-white font-medium">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.supplier}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-400 font-bold">{p.currentStock} {p.unit}</p>
                    <p className="text-xs text-gray-500">min: {p.minStock}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {lang === 'es' ? 'Todo el stock sobre el mínimo' : 'All stock above minimum'}
            </p>
          )}
        </div>

        {/* Recent Movements */}
        <div className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-austral-clay font-bold mb-4">
            {t.dashboard.recentMovements}
          </p>
          <div className="space-y-3">
            {movements.slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      m.type === 'entrada'
                        ? 'bg-green-400'
                        : m.type === 'salida'
                        ? 'bg-blue-400'
                        : m.type === 'merma'
                        ? 'bg-red-400'
                        : 'bg-yellow-400'
                    }`}
                  />
                  <div>
                    <p className="text-white">{m.productName}</p>
                    <p className="text-xs text-gray-500">{m.responsable} · {m.date}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold ${
                    m.type === 'entrada' ? 'text-green-400' : m.type === 'merma' ? 'text-red-400' : 'text-gray-400'
                  }`}
                >
                  {m.type === 'entrada' ? '+' : '-'}{m.quantity}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Loss Breakdown */}
        <div className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-austral-clay font-bold mb-4">
            {t.dashboard.lossBreakdown}
          </p>
          {lossByReason.length > 0 ? (
            <div className="space-y-3">
              {lossByReason.map(([reason, amount]) => {
                const maxAmount = lossByReason[0][1];
                const pct = maxAmount > 0 ? (amount / maxAmount) * 100 : 0;
                return (
                  <div key={reason}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">
                        {t.losses.reasons[reason as keyof typeof t.losses.reasons] || reason}
                      </span>
                      <span className="text-red-400 font-medium">{formatCLP(amount)}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5">
                      <div
                        className="bg-austral-clay h-1.5 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-500 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              {lang === 'es' ? 'Sin mermas registradas' : 'No losses recorded'}
            </p>
          )}
        </div>
      </div>
    </div>
  );

  // ── Render: Products ──

  const renderProducts = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder={t.products.search}
            className={`${inputClass} pl-10`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className={btnPrimary} onClick={() => setShowCamera(true)}>
          <Camera className="w-4 h-4" /> {lang === 'es' ? 'Escanear producto' : 'Scan product'}
        </button>
        <button className={btnPrimary} onClick={() => setShowProductForm(true)}>
          <Plus className="w-4 h-4" /> {t.products.addProduct}
        </button>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className={`${cardClass} border-austral-clay/30`}>
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-serif text-white">{t.products.addProduct}</p>
            <button onClick={() => setShowProductForm(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>{t.products.name}</label>
              <input className={inputClass} value={newProduct.name || ''} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{t.products.sku}</label>
              <input className={inputClass} value={newProduct.sku || ''} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{t.products.category}</label>
              <select className={selectClass} value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value as ProductCategory })}>
                {Object.entries(t.categories).map(([key, label]) => (
                  <option key={key} value={key}>{label as string}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t.products.unit}</label>
              <select className={selectClass} value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}>
                {t.units.map((u: string) => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t.products.zone}</label>
              <select className={selectClass} value={newProduct.storageZone} onChange={(e) => setNewProduct({ ...newProduct, storageZone: e.target.value as StorageZone })}>
                {Object.entries(t.zones).map(([key, label]) => (
                  <option key={key} value={key}>{label as string}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t.products.supplier}</label>
              <input className={inputClass} value={newProduct.supplier || ''} onChange={(e) => setNewProduct({ ...newProduct, supplier: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{t.products.minStock}</label>
              <input type="number" className={inputClass} value={newProduct.minStock || ''} onChange={(e) => setNewProduct({ ...newProduct, minStock: Number(e.target.value) })} />
            </div>
            <div>
              <label className={labelClass}>{t.products.maxStock}</label>
              <input type="number" className={inputClass} value={newProduct.maxStock || ''} onChange={(e) => setNewProduct({ ...newProduct, maxStock: Number(e.target.value) })} />
            </div>
            <div>
              <label className={labelClass}>{t.products.currentStock}</label>
              <input type="number" className={inputClass} value={newProduct.currentStock || ''} onChange={(e) => setNewProduct({ ...newProduct, currentStock: Number(e.target.value) })} />
            </div>
            <div>
              <label className={labelClass}>{t.products.cost}</label>
              <input type="number" className={inputClass} value={newProduct.costPerUnit || ''} onChange={(e) => setNewProduct({ ...newProduct, costPerUnit: Number(e.target.value) })} />
            </div>
            <div>
              <label className={labelClass}>{t.products.shelfLife}</label>
              <input type="number" className={inputClass} value={newProduct.shelfLifeDays || ''} onChange={(e) => setNewProduct({ ...newProduct, shelfLifeDays: Number(e.target.value) })} />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className={btnPrimary} onClick={addProduct}>{t.products.save}</button>
            <button className={btnSecondary} onClick={() => setShowProductForm(false)}>{t.products.cancel}</button>
          </div>
        </div>
      )}

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
              <th className="py-3 pr-4">{t.products.name}</th>
              <th className="py-3 pr-4">{t.products.sku}</th>
              <th className="py-3 pr-4">{t.products.category}</th>
              <th className="py-3 pr-4">{t.products.zone}</th>
              <th className="py-3 pr-4 text-right">{t.products.currentStock}</th>
              <th className="py-3 pr-4 text-right">{t.products.cost}</th>
              <th className="py-3 pr-4">{t.products.supplier}</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4">
                  <p className="text-white font-medium">{p.name}</p>
                </td>
                <td className="py-3 pr-4 text-gray-400">{p.sku}</td>
                <td className="py-3 pr-4">
                  <span className="text-xs px-2 py-0.5 bg-white/5 text-gray-300">
                    {t.categories[p.category as keyof typeof t.categories]}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    {t.zones[p.storageZone as keyof typeof t.zones]}
                  </span>
                </td>
                <td className={`py-3 pr-4 text-right font-bold ${p.currentStock <= p.minStock ? 'text-red-400' : 'text-white'}`}>
                  {p.currentStock} {p.unit}
                  {p.currentStock <= p.minStock && (
                    <AlertTriangle className="w-3 h-3 inline ml-1 text-red-400" />
                  )}
                </td>
                <td className="py-3 pr-4 text-right text-gray-300">{formatCLP(p.costPerUnit)}</td>
                <td className="py-3 pr-4 text-gray-400">{p.supplier}</td>
                <td className="py-3">
                  <button onClick={() => deleteProduct(p.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Render: Movements ──

  const renderMovements = () => (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className={btnPrimary} onClick={() => setShowMovementForm(true)}>
          <Plus className="w-4 h-4" /> {t.movements.addMovement}
        </button>
      </div>

      {showMovementForm && (
        <div className={`${cardClass} border-austral-clay/30`}>
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-serif text-white">{t.movements.addMovement}</p>
            <button onClick={() => setShowMovementForm(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>{t.movements.product}</label>
              <select className={selectClass} value={newMovement.productId || ''} onChange={(e) => setNewMovement({ ...newMovement, productId: e.target.value })}>
                <option value="">—</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.currentStock} {p.unit})</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t.movements.type}</label>
              <select className={selectClass} value={newMovement.type} onChange={(e) => setNewMovement({ ...newMovement, type: e.target.value as MovementType })}>
                {Object.entries(t.movements.types).map(([key, label]) => (
                  <option key={key} value={key}>{label as string}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t.movements.quantity}</label>
              <input type="number" className={inputClass} value={newMovement.quantity || ''} onChange={(e) => setNewMovement({ ...newMovement, quantity: Number(e.target.value) })} />
            </div>
            <div>
              <label className={labelClass}>{t.movements.responsable}</label>
              <input className={inputClass} value={newMovement.responsable || ''} onChange={(e) => setNewMovement({ ...newMovement, responsable: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{t.movements.date}</label>
              <input type="date" className={inputClass} value={newMovement.date || ''} onChange={(e) => setNewMovement({ ...newMovement, date: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{t.movements.notes}</label>
              <input className={inputClass} value={newMovement.notes || ''} onChange={(e) => setNewMovement({ ...newMovement, notes: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className={btnPrimary} onClick={addMovement}>{t.products.save}</button>
            <button className={btnSecondary} onClick={() => setShowMovementForm(false)}>{t.products.cancel}</button>
          </div>
        </div>
      )}

      {/* Movements Log */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
              <th className="py-3 pr-4">{t.movements.date}</th>
              <th className="py-3 pr-4">{t.movements.product}</th>
              <th className="py-3 pr-4">{t.movements.type}</th>
              <th className="py-3 pr-4 text-right">{t.movements.quantity}</th>
              <th className="py-3 pr-4">{t.movements.responsable}</th>
              <th className="py-3">{t.movements.notes}</th>
            </tr>
          </thead>
          <tbody>
            {movements.map((m) => (
              <tr key={m.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4 text-gray-400">{m.date}</td>
                <td className="py-3 pr-4 text-white font-medium">{m.productName}</td>
                <td className="py-3 pr-4">
                  <span
                    className={`text-xs px-2 py-0.5 font-bold ${
                      m.type === 'entrada'
                        ? 'bg-green-500/10 text-green-400'
                        : m.type === 'salida'
                        ? 'bg-blue-500/10 text-blue-400'
                        : m.type === 'merma'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}
                  >
                    {t.movements.types[m.type as keyof typeof t.movements.types]}
                  </span>
                </td>
                <td className={`py-3 pr-4 text-right font-bold ${m.type === 'entrada' ? 'text-green-400' : m.type === 'merma' ? 'text-red-400' : 'text-gray-300'}`}>
                  {m.type === 'entrada' ? '+' : '-'}{m.quantity}
                </td>
                <td className="py-3 pr-4 text-gray-400">{m.responsable}</td>
                <td className="py-3 text-gray-500 text-xs">{m.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Render: Expirations ──

  const renderExpirations = () => {
    const allBatchesWithDays = batches
      .map((b) => ({
        ...b,
        product: products.find((p) => p.id === b.productId),
        daysLeft: daysUntil(b.expirationDate),
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft);

    const expired = allBatchesWithDays.filter((b) => b.daysLeft < 0);
    const critical = allBatchesWithDays.filter((b) => b.daysLeft >= 0 && b.daysLeft <= 2);
    const warning = allBatchesWithDays.filter((b) => b.daysLeft > 2 && b.daysLeft <= 7);
    const ok = allBatchesWithDays.filter((b) => b.daysLeft > 7);

    const renderBatchGroup = (title: string, items: typeof allBatchesWithDays, colorClass: string) => {
      if (items.length === 0) return null;
      return (
        <div className={cardClass}>
          <p className={`text-xs uppercase tracking-wider font-bold mb-4 ${colorClass}`}>{title} ({items.length})</p>
          <div className="space-y-3">
            {items.map((b) => (
              <div key={b.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-white font-medium">{b.product?.name}</p>
                  <p className="text-xs text-gray-500">
                    {t.expiry.lot}: {b.lotNumber} · {b.quantity} {b.product?.unit} · {lang === 'es' ? 'Vence' : 'Exp'}: {b.expirationDate}
                  </p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 ${
                  b.daysLeft < 0 ? 'bg-red-500/20 text-red-300'
                    : b.daysLeft <= 2 ? 'bg-red-500/10 text-red-400'
                    : b.daysLeft <= 7 ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-green-500/10 text-green-400'
                }`}>
                  {b.daysLeft < 0
                    ? t.expiry.expired
                    : `${b.daysLeft} ${t.expiry.daysLeft}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`${cardClass} border-l-2 border-l-red-500`}>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t.expiry.expired}</p>
            <p className="text-2xl font-serif text-red-400">{expired.length}</p>
          </div>
          <div className={`${cardClass} border-l-2 border-l-red-400`}>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t.expiry.critical}</p>
            <p className="text-2xl font-serif text-red-400">{critical.length}</p>
          </div>
          <div className={`${cardClass} border-l-2 border-l-yellow-400`}>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t.expiry.warning}</p>
            <p className="text-2xl font-serif text-yellow-400">{warning.length}</p>
          </div>
          <div className={`${cardClass} border-l-2 border-l-green-400`}>
            <p className="text-xs text-gray-400 uppercase tracking-wider">{t.expiry.ok}</p>
            <p className="text-2xl font-serif text-green-400">{ok.length}</p>
          </div>
        </div>

        {renderBatchGroup(t.expiry.expired, expired, 'text-red-400')}
        {renderBatchGroup(t.expiry.critical, critical, 'text-red-400')}
        {renderBatchGroup(t.expiry.warning, warning, 'text-yellow-400')}
        {renderBatchGroup(t.expiry.ok, ok, 'text-green-400')}
      </div>
    );
  };

  // ── Render: Losses ──

  const renderLosses = () => (
    <div className="space-y-6">
      {/* Loss KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{t.losses.totalLoss}</p>
          <p className="text-3xl font-serif text-red-400">{formatCLP(monthlyLoss)}</p>
        </div>
        <div className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{t.losses.preventableRate}</p>
          <p className="text-3xl font-serif text-yellow-400">{preventableRate}%</p>
        </div>
        <div className={cardClass}>
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-1">{lang === 'es' ? 'Registros' : 'Records'}</p>
          <p className="text-3xl font-serif text-white">{losses.length}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <button className={btnPrimary} onClick={() => setShowLossForm(true)}>
          <Plus className="w-4 h-4" /> {t.losses.addLoss}
        </button>
      </div>

      {showLossForm && (
        <div className={`${cardClass} border-austral-clay/30`}>
          <div className="flex justify-between items-center mb-6">
            <p className="text-lg font-serif text-white">{t.losses.addLoss}</p>
            <button onClick={() => setShowLossForm(false)} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>{t.movements.product}</label>
              <select className={selectClass} value={newLoss.productId || ''} onChange={(e) => setNewLoss({ ...newLoss, productId: e.target.value })}>
                <option value="">—</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t.losses.reason}</label>
              <select className={selectClass} value={newLoss.reason} onChange={(e) => setNewLoss({ ...newLoss, reason: e.target.value as LossReason })}>
                {Object.entries(t.losses.reasons).map(([key, label]) => (
                  <option key={key} value={key}>{label as string}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t.movements.quantity}</label>
              <input type="number" className={inputClass} value={newLoss.quantity || ''} onChange={(e) => setNewLoss({ ...newLoss, quantity: Number(e.target.value) })} />
            </div>
            <div>
              <label className={labelClass}>{t.movements.responsable}</label>
              <input className={inputClass} value={newLoss.responsable || ''} onChange={(e) => setNewLoss({ ...newLoss, responsable: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{t.movements.date}</label>
              <input type="date" className={inputClass} value={newLoss.date || ''} onChange={(e) => setNewLoss({ ...newLoss, date: e.target.value })} />
            </div>
            <div>
              <label className={labelClass}>{t.losses.preventable}</label>
              <select className={selectClass} value={newLoss.preventable ? 'yes' : 'no'} onChange={(e) => setNewLoss({ ...newLoss, preventable: e.target.value === 'yes' })}>
                <option value="yes">{t.losses.yes}</option>
                <option value="no">{t.losses.no}</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className={labelClass}>{t.movements.notes}</label>
              <input className={inputClass} value={newLoss.notes || ''} onChange={(e) => setNewLoss({ ...newLoss, notes: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button className={btnPrimary} onClick={addLoss}>{t.products.save}</button>
            <button className={btnSecondary} onClick={() => setShowLossForm(false)}>{t.products.cancel}</button>
          </div>
        </div>
      )}

      {/* Losses Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
              <th className="py-3 pr-4">{t.movements.date}</th>
              <th className="py-3 pr-4">{t.movements.product}</th>
              <th className="py-3 pr-4">{t.losses.reason}</th>
              <th className="py-3 pr-4 text-right">{t.movements.quantity}</th>
              <th className="py-3 pr-4 text-right">{t.losses.costImpact}</th>
              <th className="py-3 pr-4">{t.losses.preventable}</th>
              <th className="py-3">{t.movements.notes}</th>
            </tr>
          </thead>
          <tbody>
            {losses.map((l) => (
              <tr key={l.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-3 pr-4 text-gray-400">{l.date}</td>
                <td className="py-3 pr-4 text-white font-medium">{l.productName}</td>
                <td className="py-3 pr-4">
                  <span className="text-xs px-2 py-0.5 bg-red-500/10 text-red-400">
                    {t.losses.reasons[l.reason as keyof typeof t.losses.reasons]}
                  </span>
                </td>
                <td className="py-3 pr-4 text-right text-red-400 font-bold">{l.quantity}</td>
                <td className="py-3 pr-4 text-right text-red-400">{formatCLP(l.costImpact)}</td>
                <td className="py-3 pr-4">
                  {l.preventable ? (
                    <span className="text-xs px-2 py-0.5 bg-yellow-500/10 text-yellow-400">{t.losses.yes}</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 bg-gray-500/10 text-gray-400">{t.losses.no}</span>
                  )}
                </td>
                <td className="py-3 text-gray-500 text-xs">{l.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Render: Reports ──

  const renderReports = () => {
    const topLossProducts = [...losses]
      .reduce((acc, l) => {
        const existing = acc.find((a) => a.productId === l.productId);
        if (existing) {
          existing.totalCost += l.costImpact;
          existing.totalQty += l.quantity;
          existing.count++;
        } else {
          acc.push({
            productId: l.productId,
            productName: l.productName,
            totalCost: l.costImpact,
            totalQty: l.quantity,
            count: 1,
          });
        }
        return acc;
      }, [] as { productId: string; productName: string; totalCost: number; totalQty: number; count: number }[])
      .sort((a, b) => b.totalCost - a.totalCost);

    const recommendations = [];
    const preventableLosses = losses.filter((l) => l.preventable);
    if (preventableLosses.length > losses.length * 0.5) {
      recommendations.push(
        lang === 'es'
          ? 'Más del 50% de las mermas son prevenibles. Revise protocolos de almacenamiento y cadena de frío.'
          : 'Over 50% of losses are preventable. Review storage protocols and cold chain.'
      );
    }
    const expiryLosses = losses.filter((l) => l.reason === 'vencimiento');
    if (expiryLosses.length >= 2) {
      recommendations.push(
        lang === 'es'
          ? 'Pérdidas recurrentes por vencimiento. Implemente sistema FIFO estricto y revise volúmenes de compra.'
          : 'Recurring expiration losses. Implement strict FIFO system and review purchase volumes.'
      );
    }
    const storageLosses = losses.filter((l) => l.reason === 'mal_almacenamiento');
    if (storageLosses.length >= 1) {
      recommendations.push(
        lang === 'es'
          ? 'Mermas por mal almacenamiento detectadas. Capacite al personal en protocolos de temperatura y manipulación.'
          : 'Poor storage losses detected. Train staff on temperature protocols and handling.'
      );
    }
    if (lowStockProducts.length >= 3) {
      recommendations.push(
        lang === 'es'
          ? 'Varios productos bajo stock mínimo. Automatice pedidos a proveedores o ajuste frecuencia de compra.'
          : 'Multiple products below minimum stock. Automate supplier orders or adjust purchase frequency.'
      );
    }
    if (Number(lossPercentage) > 2) {
      recommendations.push(
        lang === 'es'
          ? `La merma actual (${lossPercentage}%) excede la meta del 2%. Priorice productos perecibles y control FIFO.`
          : `Current loss (${lossPercentage}%) exceeds the 2% target. Prioritize perishables and FIFO control.`
      );
    }
    if (recommendations.length === 0) {
      recommendations.push(
        lang === 'es'
          ? 'El inventario está dentro de los parámetros normales. Continúe con controles periódicos.'
          : 'Inventory is within normal parameters. Continue with periodic controls.'
      );
    }

    return (
      <div className="space-y-6">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Loss vs Inventory */}
          <div className={cardClass}>
            <p className="text-xs uppercase tracking-wider text-austral-clay font-bold mb-4">
              {t.reports.lossVsInventory}
            </p>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{t.dashboard.totalValue}</span>
                  <span className="text-white font-medium">{formatCLP(totalInventoryValue)}</span>
                </div>
                <div className="w-full bg-white/5 h-3">
                  <div className="bg-green-500/60 h-3" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{t.dashboard.monthlyLoss}</span>
                  <span className="text-red-400 font-medium">{formatCLP(monthlyLoss)} ({lossPercentage}%)</span>
                </div>
                <div className="w-full bg-white/5 h-3">
                  <div
                    className={`h-3 ${Number(lossPercentage) > 2 ? 'bg-red-500/60' : 'bg-yellow-500/60'}`}
                    style={{ width: `${Math.min(Number(lossPercentage) * 5, 100)}%` }}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {t.dashboard.lossTarget}
              </p>
            </div>
          </div>

          {/* Losses By Reason */}
          <div className={cardClass}>
            <p className="text-xs uppercase tracking-wider text-austral-clay font-bold mb-4">
              {t.reports.lossByReason}
            </p>
            <div className="space-y-3">
              {lossByReason.map(([reason, amount]) => {
                const pct = monthlyLoss > 0 ? ((amount / monthlyLoss) * 100).toFixed(0) : 0;
                return (
                  <div key={reason} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">
                      {t.losses.reasons[reason as keyof typeof t.losses.reasons] || reason}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500">{pct}%</span>
                      <span className="text-red-400 font-medium w-24 text-right">{formatCLP(amount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Losses by Category */}
          <div className={cardClass}>
            <p className="text-xs uppercase tracking-wider text-austral-clay font-bold mb-4">
              {t.reports.lossByCategory}
            </p>
            <div className="space-y-3">
              {lossByCategory.map(([category, amount]) => {
                const maxCat = lossByCategory[0][1];
                const pct = maxCat > 0 ? (amount / maxCat) * 100 : 0;
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">
                        {t.categories[category as keyof typeof t.categories] || category}
                      </span>
                      <span className="text-red-400 font-medium">{formatCLP(amount)}</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5">
                      <div className="bg-austral-clay h-1.5 transition-all duration-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Loss Products */}
          <div className={cardClass}>
            <p className="text-xs uppercase tracking-wider text-austral-clay font-bold mb-4">
              {t.reports.topLosses}
            </p>
            <div className="space-y-3">
              {topLossProducts.slice(0, 5).map((item, idx) => (
                <div key={item.productId} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 w-5">{idx + 1}.</span>
                    <div>
                      <p className="text-white font-medium">{item.productName}</p>
                      <p className="text-xs text-gray-500">{item.count} {lang === 'es' ? 'registros' : 'records'}</p>
                    </div>
                  </div>
                  <span className="text-red-400 font-bold">{formatCLP(item.totalCost)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className={`${cardClass} border-austral-clay/30`}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-austral-clay" />
            <p className="text-xs uppercase tracking-wider text-austral-clay font-bold">
              {t.reports.recommendations}
            </p>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-gray-200">
                <span className="text-austral-clay font-bold mt-0.5">{idx + 1}.</span>
                <p>{rec}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── Main Render ──

  const viewRenderers: Record<BodegaView, () => React.ReactNode> = {
    dashboard: renderDashboard,
    productos: renderProducts,
    movimientos: renderMovements,
    vencimientos: renderExpirations,
    mermas: renderLosses,
    reportes: renderReports,
  };

  return (
    <section id="bodega" className="py-32 px-6 md:px-12 bg-austral-dark text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-austral-dark">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-austral-clay/8 rounded-full blur-[150px] opacity-15"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-red-900/5 rounded-full blur-[120px] opacity-10"></div>
      </div>

      <div
        ref={ref}
        className={`max-w-7xl mx-auto relative z-10 transition-all duration-1000 ${
          inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-1 border border-austral-clay/30 text-austral-clay text-[10px] tracking-[0.2em] uppercase">
            <Warehouse className="w-3 h-3" />
            <span>{t.eyebrow}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-white leading-tight">{t.title}</h2>
          <p className="text-gray-400 text-xl font-light">{t.subtitle}</p>
        </div>

        {/* View Navigation */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          {viewButtons.map((vb) => (
            <button
              key={vb.key}
              onClick={() => setActiveView(vb.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-bold transition-all ${
                activeView === vb.key
                  ? 'bg-austral-clay text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
            >
              {vb.icon}
              {t.views[vb.key as keyof typeof t.views]}
            </button>
          ))}
        </div>

        {/* Active View */}
        <div className="min-h-[400px]">
          {viewRenderers[activeView]()}
        </div>
      </div>

      {/* Camera Scanner Modal */}
      {showCamera && (
        <CameraScanner
          lang={lang}
          existingProducts={products}
          onProductIdentified={handleCameraProductIdentified}
          onProductMatched={handleCameraProductMatched}
          onClose={() => setShowCamera(false)}
        />
      )}
    </section>
  );
};

export default BodegaInventory;
