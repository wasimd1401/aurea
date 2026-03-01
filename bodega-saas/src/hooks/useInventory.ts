import { useState, useEffect, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from './useAuth'
import type {
  BodegaProduct, StockBatch, StockMovement, LossRecord, BodegaAlert,
  MovementType, LossReason, DashboardMetrics, ProductCategory, StorageZone, ProductUnit,
} from '@/lib/types'

// Demo seed data
function createDemoProducts(orgId: string): BodegaProduct[] {
  const now = new Date().toISOString()
  return [
    { id: '1', org_id: orgId, name: 'Lomo vetado', sku: 'CAR-001', category: 'carnes', unit: 'kg', storage_zone: 'refrigerado', current_stock: 12, min_stock: 5, max_stock: 30, cost_per_unit: 14500, supplier: 'Carnes del Sur', shelf_life_days: 5, created_at: now, updated_at: now },
    { id: '2', org_id: orgId, name: 'Salmón fresco', sku: 'PES-001', category: 'pescados', unit: 'kg', storage_zone: 'refrigerado', current_stock: 3, min_stock: 4, max_stock: 15, cost_per_unit: 18900, supplier: 'Pesquera Austral', shelf_life_days: 3, created_at: now, updated_at: now },
    { id: '3', org_id: orgId, name: 'Queso mantecoso', sku: 'LAC-001', category: 'lacteos', unit: 'kg', storage_zone: 'refrigerado', current_stock: 8, min_stock: 3, max_stock: 15, cost_per_unit: 8500, supplier: 'Lácteos Osorno', shelf_life_days: 21, created_at: now, updated_at: now },
    { id: '4', org_id: orgId, name: 'Papas', sku: 'VER-001', category: 'verduras', unit: 'kg', storage_zone: 'seco', current_stock: 25, min_stock: 10, max_stock: 50, cost_per_unit: 1200, supplier: 'Agrícola Central', shelf_life_days: 14, created_at: now, updated_at: now },
    { id: '5', org_id: orgId, name: 'Limones', sku: 'FRU-001', category: 'frutas', unit: 'kg', storage_zone: 'ambiente', current_stock: 6, min_stock: 3, max_stock: 15, cost_per_unit: 2800, supplier: 'Frutícola Norte', shelf_life_days: 10, created_at: now, updated_at: now },
    { id: '6', org_id: orgId, name: 'Arroz grado 1', sku: 'ABA-001', category: 'abarrotes', unit: 'kg', storage_zone: 'seco', current_stock: 20, min_stock: 10, max_stock: 50, cost_per_unit: 1500, supplier: 'Distribuidora Nacional', shelf_life_days: 180, created_at: now, updated_at: now },
    { id: '7', org_id: orgId, name: 'Carménère Reserva', sku: 'BEB-001', category: 'bebidas', unit: 'botella', storage_zone: 'ambiente', current_stock: 18, min_stock: 6, max_stock: 36, cost_per_unit: 6500, supplier: 'Viña Concha y Toro', shelf_life_days: 730, created_at: now, updated_at: now },
    { id: '8', org_id: orgId, name: 'Congrio dorado', sku: 'PES-002', category: 'pescados', unit: 'kg', storage_zone: 'congelado', current_stock: 7, min_stock: 3, max_stock: 12, cost_per_unit: 22000, supplier: 'Pesquera Austral', shelf_life_days: 90, created_at: now, updated_at: now },
    { id: '9', org_id: orgId, name: 'Merkén', sku: 'CON-001', category: 'condimentos', unit: 'unidad', storage_zone: 'seco', current_stock: 5, min_stock: 2, max_stock: 10, cost_per_unit: 3200, supplier: 'Especias Mapuche', shelf_life_days: 365, created_at: now, updated_at: now },
    { id: '10', org_id: orgId, name: 'Helado manjar', sku: 'CON-002', category: 'congelados', unit: 'lt', storage_zone: 'congelado', current_stock: 4, min_stock: 2, max_stock: 10, cost_per_unit: 5800, supplier: 'Helados Artesanales', shelf_life_days: 120, created_at: now, updated_at: now },
  ]
}

function createDemoBatches(orgId: string): StockBatch[] {
  const today = new Date()
  const d = (days: number) => {
    const date = new Date(today)
    date.setDate(date.getDate() + days)
    return date.toISOString().split('T')[0]
  }
  const past = (days: number) => {
    const date = new Date(today)
    date.setDate(date.getDate() - days)
    return date.toISOString().split('T')[0]
  }
  return [
    { id: 'b1', product_id: '1', org_id: orgId, lot_number: 'L-2024-001', quantity: 12, expiration_date: d(3), received_date: past(2), created_at: new Date().toISOString() },
    { id: 'b2', product_id: '2', org_id: orgId, lot_number: 'L-2024-002', quantity: 3, expiration_date: d(1), received_date: past(2), created_at: new Date().toISOString() },
    { id: 'b3', product_id: '3', org_id: orgId, lot_number: 'L-2024-003', quantity: 8, expiration_date: d(15), received_date: past(6), created_at: new Date().toISOString() },
    { id: 'b4', product_id: '5', org_id: orgId, lot_number: 'L-2024-004', quantity: 6, expiration_date: d(5), received_date: past(5), created_at: new Date().toISOString() },
    { id: 'b5', product_id: '10', org_id: orgId, lot_number: 'L-2024-005', quantity: 4, expiration_date: d(-2), received_date: past(30), created_at: new Date().toISOString() },
  ]
}

function createDemoMovements(orgId: string): StockMovement[] {
  const past = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString()
  }
  return [
    { id: 'm1', product_id: '1', org_id: orgId, type: 'entrada', quantity: 15, date: past(2), responsible: 'Carlos', notes: 'Pedido semanal', created_at: past(2) },
    { id: 'm2', product_id: '2', org_id: orgId, type: 'entrada', quantity: 5, date: past(2), responsible: 'Carlos', notes: 'Pedido especial', created_at: past(2) },
    { id: 'm3', product_id: '1', org_id: orgId, type: 'salida', quantity: 3, date: past(1), responsible: 'María', notes: 'Servicio almuerzo', created_at: past(1) },
    { id: 'm4', product_id: '2', org_id: orgId, type: 'merma', quantity: 2, date: past(1), responsible: 'María', notes: 'Deterioro por temperatura', created_at: past(1) },
  ]
}

function createDemoLosses(orgId: string): LossRecord[] {
  const past = (days: number) => {
    const date = new Date()
    date.setDate(date.getDate() - days)
    return date.toISOString()
  }
  return [
    { id: 'l1', product_id: '2', org_id: orgId, quantity: 2, reason: 'deterioro', cost_impact: 37800, date: past(1), responsible: 'María', preventable: true, notes: 'Falla en refrigerador', created_at: past(1) },
    { id: 'l2', product_id: '10', org_id: orgId, quantity: 1, reason: 'vencimiento', cost_impact: 5800, date: past(3), responsible: 'Carlos', preventable: true, notes: 'No se rotó stock', created_at: past(3) },
    { id: 'l3', product_id: '5', org_id: orgId, quantity: 1.5, reason: 'deterioro', cost_impact: 4200, date: past(5), responsible: 'Pedro', preventable: false, notes: 'Producto llegó en mal estado', created_at: past(5) },
  ]
}

export function useInventory() {
  const { profile, organization, isDemo } = useAuth()
  const orgId = organization?.id || 'demo-org'

  const [products, setProducts] = useState<BodegaProduct[]>([])
  const [batches, setBatches] = useState<StockBatch[]>([])
  const [movements, setMovements] = useState<StockMovement[]>([])
  const [losses, setLosses] = useState<LossRecord[]>([])
  const [alerts, setAlerts] = useState<BodegaAlert[]>([])
  const [loading, setLoading] = useState(true)

  // Load data
  useEffect(() => {
    if (isDemo || !isSupabaseConfigured()) {
      setProducts(createDemoProducts(orgId))
      setBatches(createDemoBatches(orgId))
      setMovements(createDemoMovements(orgId))
      setLosses(createDemoLosses(orgId))
      setLoading(false)
      return
    }

    if (!profile) return

    async function load() {
      setLoading(true)
      const [pRes, bRes, mRes, lRes] = await Promise.all([
        supabase.from('products').select('*').order('name'),
        supabase.from('stock_batches').select('*').order('expiration_date'),
        supabase.from('stock_movements').select('*, product:products(name)').order('date', { ascending: false }).limit(50),
        supabase.from('loss_records').select('*, product:products(name)').order('date', { ascending: false }).limit(50),
      ])
      if (pRes.data) setProducts(pRes.data as BodegaProduct[])
      if (bRes.data) setBatches(bRes.data as StockBatch[])
      if (mRes.data) setMovements(mRes.data as StockMovement[])
      if (lRes.data) setLosses(lRes.data as LossRecord[])
      setLoading(false)
    }

    load()
  }, [profile, isDemo, orgId])

  // Compute alerts
  useEffect(() => {
    const newAlerts: BodegaAlert[] = []
    const now = new Date()

    products.forEach(p => {
      if (p.current_stock <= p.min_stock) {
        newAlerts.push({
          id: `alert-low-${p.id}`,
          type: 'low_stock',
          message: `${p.name}: stock bajo (${p.current_stock} ${p.unit})`,
          product_id: p.id,
          severity: p.current_stock === 0 ? 'critical' : 'high',
          created_at: now.toISOString(),
        })
      }
    })

    batches.forEach(b => {
      const exp = new Date(b.expiration_date)
      const days = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      const product = products.find(p => p.id === b.product_id)
      if (days < 0) {
        newAlerts.push({
          id: `alert-exp-${b.id}`,
          type: 'expired',
          message: `${product?.name || 'Producto'}: lote ${b.lot_number} vencido`,
          product_id: b.product_id,
          severity: 'critical',
          created_at: now.toISOString(),
        })
      } else if (days <= 2) {
        newAlerts.push({
          id: `alert-expn-${b.id}`,
          type: 'near_expiry',
          message: `${product?.name || 'Producto'}: lote ${b.lot_number} vence en ${days} día(s)`,
          product_id: b.product_id,
          severity: 'high',
          created_at: now.toISOString(),
        })
      } else if (days <= 7) {
        newAlerts.push({
          id: `alert-expw-${b.id}`,
          type: 'near_expiry',
          message: `${product?.name || 'Producto'}: lote ${b.lot_number} vence en ${days} días`,
          product_id: b.product_id,
          severity: 'medium',
          created_at: now.toISOString(),
        })
      }
    })

    setAlerts(newAlerts)
  }, [products, batches])

  // Metrics
  const metrics: DashboardMetrics = {
    totalProducts: products.length,
    totalInventoryValue: products.reduce((sum, p) => sum + p.current_stock * p.cost_per_unit, 0),
    activeAlerts: alerts.length,
    monthlyLoss: losses.reduce((sum, l) => sum + l.cost_impact, 0),
    lossPercentage: 0,
    preventableRate: 0,
    expiringCount: batches.filter(b => {
      const days = Math.ceil((new Date(b.expiration_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      return days >= 0 && days <= 7
    }).length,
    lowStockCount: products.filter(p => p.current_stock <= p.min_stock).length,
  }
  if (metrics.totalInventoryValue > 0) {
    metrics.lossPercentage = (metrics.monthlyLoss / metrics.totalInventoryValue) * 100
  }
  if (losses.length > 0) {
    metrics.preventableRate = (losses.filter(l => l.preventable).length / losses.length) * 100
  }

  // CRUD operations
  const addProduct = useCallback(async (product: Omit<BodegaProduct, 'id' | 'org_id' | 'created_at' | 'updated_at'>) => {
    if (isDemo || !isSupabaseConfigured()) {
      const newProduct: BodegaProduct = {
        ...product,
        id: crypto.randomUUID(),
        org_id: orgId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      setProducts(prev => [...prev, newProduct])
      return newProduct
    }

    const { data, error } = await supabase
      .from('products')
      .insert({ ...product, org_id: orgId })
      .select()
      .single()
    if (error) throw error
    const newProduct = data as BodegaProduct
    setProducts(prev => [...prev, newProduct])
    return newProduct
  }, [orgId, isDemo])

  const updateProduct = useCallback(async (id: string, updates: Partial<BodegaProduct>) => {
    if (isDemo || !isSupabaseConfigured()) {
      setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p))
      return
    }
    const { error } = await supabase.from('products').update(updates).eq('id', id)
    if (error) throw error
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p))
  }, [isDemo])

  const deleteProduct = useCallback(async (id: string) => {
    if (isDemo || !isSupabaseConfigured()) {
      setProducts(prev => prev.filter(p => p.id !== id))
      setBatches(prev => prev.filter(b => b.product_id !== id))
      return
    }
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw error
    setProducts(prev => prev.filter(p => p.id !== id))
    setBatches(prev => prev.filter(b => b.product_id !== id))
  }, [isDemo])

  const addMovement = useCallback(async (movement: {
    product_id: string
    type: MovementType
    quantity: number
    responsible: string
    notes: string
  }) => {
    const product = products.find(p => p.id === movement.product_id)
    if (!product) return

    let newStock = product.current_stock
    if (movement.type === 'entrada') newStock += movement.quantity
    else if (movement.type === 'salida' || movement.type === 'merma') newStock -= movement.quantity
    else newStock = movement.quantity // ajuste

    if (isDemo || !isSupabaseConfigured()) {
      const newMov: StockMovement = {
        ...movement,
        id: crypto.randomUUID(),
        org_id: orgId,
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
      setMovements(prev => [newMov, ...prev])
      setProducts(prev => prev.map(p => p.id === movement.product_id ? { ...p, current_stock: Math.max(0, newStock) } : p))
      return
    }

    const { data, error } = await supabase
      .from('stock_movements')
      .insert({ ...movement, org_id: orgId, date: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    setMovements(prev => [data as StockMovement, ...prev])
    await updateProduct(movement.product_id, { current_stock: Math.max(0, newStock) })
  }, [products, orgId, isDemo, updateProduct])

  const addBatch = useCallback(async (batch: {
    product_id: string
    lot_number: string
    quantity: number
    expiration_date: string
  }) => {
    if (isDemo || !isSupabaseConfigured()) {
      const newBatch: StockBatch = {
        ...batch,
        id: crypto.randomUUID(),
        org_id: orgId,
        received_date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString(),
      }
      setBatches(prev => [...prev, newBatch])
      return
    }

    const { data, error } = await supabase
      .from('stock_batches')
      .insert({ ...batch, org_id: orgId, received_date: new Date().toISOString().split('T')[0] })
      .select()
      .single()
    if (error) throw error
    setBatches(prev => [...prev, data as StockBatch])
  }, [orgId, isDemo])

  const addLoss = useCallback(async (loss: {
    product_id: string
    quantity: number
    reason: LossReason
    responsible: string
    preventable: boolean
    notes: string
  }) => {
    const product = products.find(p => p.id === loss.product_id)
    const costImpact = (product?.cost_per_unit || 0) * loss.quantity

    if (isDemo || !isSupabaseConfigured()) {
      const newLoss: LossRecord = {
        ...loss,
        id: crypto.randomUUID(),
        org_id: orgId,
        cost_impact: costImpact,
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
      setLosses(prev => [newLoss, ...prev])
      if (product) {
        setProducts(prev => prev.map(p => p.id === loss.product_id
          ? { ...p, current_stock: Math.max(0, p.current_stock - loss.quantity) }
          : p
        ))
      }
      return
    }

    const { data, error } = await supabase
      .from('loss_records')
      .insert({ ...loss, org_id: orgId, cost_impact: costImpact, date: new Date().toISOString() })
      .select()
      .single()
    if (error) throw error
    setLosses(prev => [data as LossRecord, ...prev])
    if (product) {
      await updateProduct(loss.product_id, { current_stock: Math.max(0, product.current_stock - loss.quantity) })
    }
  }, [products, orgId, isDemo, updateProduct])

  return {
    products,
    batches,
    movements,
    losses,
    alerts,
    metrics,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    addMovement,
    addBatch,
    addLoss,
  }
}
