export type Language = 'es' | 'en';

export interface NavItem {
  label: string;
  href: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  detailedDesc?: string;
  features?: string[];
}

// ── Bodega Inventory System Types ──

export type ProductCategory =
  | 'carnes'
  | 'pescados'
  | 'lacteos'
  | 'verduras'
  | 'frutas'
  | 'abarrotes'
  | 'bebidas'
  | 'congelados'
  | 'condimentos'
  | 'limpieza';

export type StorageZone = 'refrigerado' | 'congelado' | 'seco' | 'ambiente';

export type MovementType = 'entrada' | 'salida' | 'ajuste' | 'merma';

export type LossReason =
  | 'vencimiento'
  | 'deterioro'
  | 'robo'
  | 'error_conteo'
  | 'mal_almacenamiento'
  | 'devolucion_proveedor'
  | 'otro';

export type AlertLevel = 'critico' | 'advertencia' | 'info';

export interface BodegaProduct {
  id: string;
  name: string;
  sku: string;
  category: ProductCategory;
  unit: string; // kg, lt, unidad, caja
  storageZone: StorageZone;
  minStock: number;
  maxStock: number;
  currentStock: number;
  costPerUnit: number; // CLP
  supplier: string;
  shelfLifeDays: number;
  createdAt: string;
}

export interface StockBatch {
  id: string;
  productId: string;
  quantity: number;
  expirationDate: string;
  receivedDate: string;
  lotNumber: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  type: MovementType;
  quantity: number;
  date: string;
  responsable: string;
  notes: string;
  batchId?: string;
}

export interface LossRecord {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  reason: LossReason;
  costImpact: number; // CLP
  date: string;
  responsable: string;
  notes: string;
  preventable: boolean;
}

export interface BodegaAlert {
  id: string;
  level: AlertLevel;
  message: string;
  productId?: string;
  productName?: string;
  date: string;
  dismissed: boolean;
}

export type BodegaView =
  | 'dashboard'
  | 'productos'
  | 'movimientos'
  | 'vencimientos'
  | 'mermas'
  | 'reportes';
