import type { Language } from './types'

export const content: Record<string, Record<Language, string>> = {
  // Nav
  navDashboard: { es: 'Panel', en: 'Dashboard' },
  navProducts: { es: 'Productos', en: 'Products' },
  navMovements: { es: 'Movimientos', en: 'Movements' },
  navExpiry: { es: 'Vencimientos', en: 'Expiration' },
  navLoss: { es: 'Mermas', en: 'Losses' },
  navReports: { es: 'Reportes', en: 'Reports' },
  navSettings: { es: 'Configuración', en: 'Settings' },
  navBilling: { es: 'Facturación', en: 'Billing' },

  // Auth
  loginTitle: { es: 'Iniciar Sesión', en: 'Sign In' },
  signupTitle: { es: 'Crear Cuenta', en: 'Create Account' },
  email: { es: 'Email', en: 'Email' },
  password: { es: 'Contraseña', en: 'Password' },
  fullName: { es: 'Nombre completo', en: 'Full name' },
  orgName: { es: 'Nombre del restaurante', en: 'Restaurant name' },
  login: { es: 'Iniciar sesión', en: 'Sign in' },
  signup: { es: 'Crear cuenta', en: 'Sign up' },
  noAccount: { es: '¿No tienes cuenta?', en: "Don't have an account?" },
  hasAccount: { es: '¿Ya tienes cuenta?', en: 'Already have an account?' },
  forgotPassword: { es: '¿Olvidaste tu contraseña?', en: 'Forgot password?' },
  logout: { es: 'Cerrar sesión', en: 'Log out' },

  // Dashboard
  totalProducts: { es: 'Total productos', en: 'Total products' },
  inventoryValue: { es: 'Valor inventario', en: 'Inventory value' },
  activeAlerts: { es: 'Alertas activas', en: 'Active alerts' },
  monthlyLoss: { es: 'Merma mensual', en: 'Monthly loss' },
  lossTarget: { es: 'Objetivo: < 2%', en: 'Target: < 2%' },
  nearExpiry: { es: 'Por vencer (7 días)', en: 'Expiring (7 days)' },
  lowStock: { es: 'Stock bajo', en: 'Low stock' },
  recentMovements: { es: 'Movimientos recientes', en: 'Recent movements' },

  // Products
  addProduct: { es: 'Agregar producto', en: 'Add product' },
  searchProducts: { es: 'Buscar productos...', en: 'Search products...' },
  productName: { es: 'Nombre del producto', en: 'Product name' },
  sku: { es: 'SKU', en: 'SKU' },
  category: { es: 'Categoría', en: 'Category' },
  unit: { es: 'Unidad', en: 'Unit' },
  storageZone: { es: 'Zona', en: 'Zone' },
  currentStock: { es: 'Stock actual', en: 'Current stock' },
  minStock: { es: 'Stock mínimo', en: 'Min stock' },
  maxStock: { es: 'Stock máximo', en: 'Max stock' },
  costPerUnit: { es: 'Costo unitario', en: 'Cost per unit' },
  supplier: { es: 'Proveedor', en: 'Supplier' },
  shelfLife: { es: 'Vida útil (días)', en: 'Shelf life (days)' },
  scanWithCamera: { es: 'Escanear con cámara', en: 'Scan with camera' },
  save: { es: 'Guardar', en: 'Save' },
  cancel: { es: 'Cancelar', en: 'Cancel' },
  delete: { es: 'Eliminar', en: 'Delete' },
  noProducts: { es: 'No hay productos aún', en: 'No products yet' },

  // Movements
  addMovement: { es: 'Registrar movimiento', en: 'Add movement' },
  movementType: { es: 'Tipo', en: 'Type' },
  quantity: { es: 'Cantidad', en: 'Quantity' },
  responsible: { es: 'Responsable', en: 'Responsible' },
  notes: { es: 'Notas', en: 'Notes' },
  date: { es: 'Fecha', en: 'Date' },
  noMovements: { es: 'No hay movimientos', en: 'No movements' },

  // Movement types
  entrada: { es: 'Entrada', en: 'Incoming' },
  salida: { es: 'Salida', en: 'Outgoing' },
  ajuste: { es: 'Ajuste', en: 'Adjustment' },
  merma: { es: 'Merma', en: 'Loss' },

  // Expiration
  lotNumber: { es: 'Número de lote', en: 'Lot number' },
  expirationDate: { es: 'Fecha de vencimiento', en: 'Expiration date' },
  daysLeft: { es: 'Días restantes', en: 'Days left' },
  expired: { es: 'Vencido', en: 'Expired' },
  critical: { es: 'Crítico', en: 'Critical' },
  warning: { es: 'Advertencia', en: 'Warning' },
  ok: { es: 'OK', en: 'OK' },
  addBatch: { es: 'Agregar lote', en: 'Add batch' },

  // Loss
  addLoss: { es: 'Registrar merma', en: 'Record loss' },
  lossReason: { es: 'Razón', en: 'Reason' },
  costImpact: { es: 'Impacto ($)', en: 'Cost impact ($)' },
  preventable: { es: 'Prevenible', en: 'Preventable' },
  totalLoss: { es: 'Total mermas', en: 'Total losses' },
  preventableRate: { es: 'Tasa prevenible', en: 'Preventable rate' },

  // Loss reasons
  vencimiento: { es: 'Vencimiento', en: 'Expiration' },
  deterioro: { es: 'Deterioro', en: 'Deterioration' },
  robo: { es: 'Robo', en: 'Theft' },
  error_conteo: { es: 'Error de conteo', en: 'Counting error' },
  mal_almacenamiento: { es: 'Mal almacenamiento', en: 'Poor storage' },
  devolucion_proveedor: { es: 'Devolución proveedor', en: 'Supplier return' },
  otro: { es: 'Otro', en: 'Other' },

  // Categories
  carnes: { es: 'Carnes', en: 'Meats' },
  pescados: { es: 'Pescados', en: 'Seafood' },
  lacteos: { es: 'Lácteos', en: 'Dairy' },
  verduras: { es: 'Verduras', en: 'Vegetables' },
  frutas: { es: 'Frutas', en: 'Fruits' },
  abarrotes: { es: 'Abarrotes', en: 'Dry goods' },
  bebidas: { es: 'Bebidas', en: 'Beverages' },
  congelados: { es: 'Congelados', en: 'Frozen' },
  condimentos: { es: 'Condimentos', en: 'Seasonings' },
  limpieza: { es: 'Limpieza', en: 'Cleaning' },

  // Zones
  refrigerado: { es: 'Refrigerado (0-5°C)', en: 'Refrigerated (0-5°C)' },
  congelado: { es: 'Congelado (-18°C)', en: 'Frozen (-18°C)' },
  seco: { es: 'Bodega seca', en: 'Dry storage' },
  ambiente: { es: 'Temperatura ambiente', en: 'Room temp' },

  // Reports
  lossVsInventory: { es: 'Mermas vs Inventario', en: 'Losses vs Inventory' },
  lossByReason: { es: 'Mermas por razón', en: 'Losses by reason' },
  lossByCategory: { es: 'Mermas por categoría', en: 'Losses by category' },
  topLossProducts: { es: 'Top productos con merma', en: 'Top loss products' },
  recommendations: { es: 'Recomendaciones', en: 'Recommendations' },

  // Landing
  heroTitle: { es: 'Control total de tu bodega', en: 'Total control of your inventory' },
  heroSubtitle: {
    es: 'Reduce mermas, controla vencimientos y optimiza tu restaurante con inteligencia artificial.',
    en: 'Reduce losses, track expiration, and optimize your restaurant with AI.',
  },
  heroCTA: { es: 'Comenzar gratis — 14 días', en: 'Start free — 14 days' },
  heroSecondary: { es: 'Ver demo', en: 'See demo' },
  pricingTitle: { es: 'Planes simples, resultados reales', en: 'Simple plans, real results' },
  pricingSubtitle: {
    es: 'Elige el plan que mejor se adapte a tu restaurante. Todos incluyen 14 días gratis.',
    en: 'Choose the plan that fits your restaurant. All include 14 free days.',
  },
  perMonth: { es: '/mes', en: '/mo' },
  choosePlan: { es: 'Elegir plan', en: 'Choose plan' },
  mostPopular: { es: 'Más popular', en: 'Most popular' },

  // Features
  feature1Title: { es: 'Control de mermas', en: 'Loss control' },
  feature1Desc: {
    es: 'Registra, analiza y reduce pérdidas con seguimiento detallado y alertas automáticas.',
    en: 'Record, analyze and reduce losses with detailed tracking and automatic alerts.',
  },
  feature2Title: { es: 'Vencimientos inteligentes', en: 'Smart expiration' },
  feature2Desc: {
    es: 'Nunca más tires producto vencido. Alertas por color, lotes y días restantes.',
    en: 'Never throw away expired product again. Color alerts, batches, and countdown.',
  },
  feature3Title: { es: 'Cámara con IA', en: 'AI Camera' },
  feature3Desc: {
    es: 'Apunta tu cámara al producto y la IA lo identifica, categoriza y registra automáticamente.',
    en: 'Point your camera at a product and AI identifies, categorizes, and registers it automatically.',
  },
  feature4Title: { es: 'Reportes accionables', en: 'Actionable reports' },
  feature4Desc: {
    es: 'Dashboards en tiempo real con recomendaciones de IA para optimizar tu operación.',
    en: 'Real-time dashboards with AI recommendations to optimize your operation.',
  },

  // Settings
  settingsTitle: { es: 'Configuración', en: 'Settings' },
  profileSection: { es: 'Perfil', en: 'Profile' },
  orgSection: { es: 'Restaurante', en: 'Restaurant' },
  teamSection: { es: 'Equipo', en: 'Team' },
  saveChanges: { es: 'Guardar cambios', en: 'Save changes' },

  // Misc
  loading: { es: 'Cargando...', en: 'Loading...' },
  error: { es: 'Error', en: 'Error' },
  success: { es: 'Éxito', en: 'Success' },
  confirm: { es: 'Confirmar', en: 'Confirm' },
  back: { es: 'Volver', en: 'Back' },
  trialBanner: {
    es: 'Estás en periodo de prueba. {days} días restantes.',
    en: "You're on a trial. {days} days remaining.",
  },
}

export function t(key: string, lang: Language, replacements?: Record<string, string | number>): string {
  const entry = content[key]
  if (!entry) return key
  let text = entry[lang] || entry.es || key
  if (replacements) {
    for (const [k, v] of Object.entries(replacements)) {
      text = text.replace(`{${k}}`, String(v))
    }
  }
  return text
}
