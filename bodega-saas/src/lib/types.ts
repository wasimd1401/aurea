// ============ Product & Inventory Types ============

export type ProductCategory =
  | 'carnes' | 'pescados' | 'lacteos' | 'verduras' | 'frutas'
  | 'abarrotes' | 'bebidas' | 'congelados' | 'condimentos' | 'limpieza'

export type StorageZone = 'refrigerado' | 'congelado' | 'seco' | 'ambiente'
export type ProductUnit = 'kg' | 'lt' | 'unidad' | 'caja' | 'botella' | 'bolsa'
export type MovementType = 'entrada' | 'salida' | 'ajuste' | 'merma'
export type LossReason =
  | 'vencimiento' | 'deterioro' | 'robo' | 'error_conteo'
  | 'mal_almacenamiento' | 'devolucion_proveedor' | 'otro'
export type AlertType = 'low_stock' | 'near_expiry' | 'expired' | 'high_loss'
export type BodegaView = 'dashboard' | 'productos' | 'movimientos' | 'vencimientos' | 'mermas' | 'reportes'
export type Language = 'es' | 'en'

export interface BodegaProduct {
  id: string
  org_id: string
  name: string
  sku: string
  category: ProductCategory
  unit: ProductUnit
  storage_zone: StorageZone
  current_stock: number
  min_stock: number
  max_stock: number
  cost_per_unit: number
  supplier: string
  shelf_life_days: number
  created_at: string
  updated_at: string
}

export interface StockBatch {
  id: string
  product_id: string
  org_id: string
  lot_number: string
  quantity: number
  expiration_date: string
  received_date: string
  created_at: string
}

export interface StockMovement {
  id: string
  product_id: string
  org_id: string
  type: MovementType
  quantity: number
  date: string
  responsible: string
  notes: string
  created_at: string
  product?: BodegaProduct
}

export interface LossRecord {
  id: string
  product_id: string
  org_id: string
  quantity: number
  reason: LossReason
  cost_impact: number
  date: string
  responsible: string
  preventable: boolean
  notes: string
  created_at: string
  product?: BodegaProduct
}

export interface BodegaAlert {
  id: string
  type: AlertType
  message: string
  product_id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  created_at: string
}

// ============ Organization & Auth Types ============

export interface Organization {
  id: string
  name: string
  slug: string
  plan: 'starter' | 'pro' | 'enterprise' | 'trial'
  plan_status: 'active' | 'past_due' | 'cancelled' | 'trialing'
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  trial_ends_at: string | null
  max_products: number
  max_users: number
  max_locations: number
  created_at: string
}

export type UserRole = 'owner' | 'admin' | 'manager' | 'staff'

export interface Profile {
  id: string
  email: string
  full_name: string
  org_id: string
  role: UserRole
  avatar_url: string | null
  created_at: string
}

// ============ Dashboard Metrics ============

export interface DashboardMetrics {
  totalProducts: number
  totalInventoryValue: number
  activeAlerts: number
  monthlyLoss: number
  lossPercentage: number
  preventableRate: number
  expiringCount: number
  lowStockCount: number
}
