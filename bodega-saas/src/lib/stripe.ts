import { loadStripe, type Stripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = () => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  if (!key || key.includes('placeholder')) return Promise.resolve(null)
  if (!stripePromise) {
    stripePromise = loadStripe(key)
  }
  return stripePromise
}

export const isStripeConfigured = () => {
  const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
  return key && !key.includes('placeholder')
}

export const PLANS = {
  starter: {
    name: 'Starter',
    priceId: import.meta.env.VITE_STRIPE_PRICE_STARTER,
    price: 29,
    currency: 'USD',
    features: {
      es: [
        'Hasta 100 productos',
        '1 ubicación',
        '2 usuarios',
        'Control de vencimientos',
        'Registro de mermas',
        'Soporte por email',
      ],
      en: [
        'Up to 100 products',
        '1 location',
        '2 users',
        'Expiration tracking',
        'Loss recording',
        'Email support',
      ],
    },
  },
  pro: {
    name: 'Pro',
    priceId: import.meta.env.VITE_STRIPE_PRICE_PRO,
    price: 79,
    currency: 'USD',
    features: {
      es: [
        'Hasta 1,000 productos',
        '3 ubicaciones',
        '10 usuarios',
        'Identificación por cámara (IA)',
        'Reportes avanzados',
        'Recomendaciones IA',
        'Soporte prioritario',
      ],
      en: [
        'Up to 1,000 products',
        '3 locations',
        '10 users',
        'Camera identification (AI)',
        'Advanced reports',
        'AI recommendations',
        'Priority support',
      ],
    },
  },
  enterprise: {
    name: 'Enterprise',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ENTERPRISE,
    price: 199,
    currency: 'USD',
    features: {
      es: [
        'Productos ilimitados',
        'Ubicaciones ilimitadas',
        'Usuarios ilimitados',
        'Todas las funciones Pro',
        'API de integración',
        'Onboarding personalizado',
        'Soporte 24/7',
      ],
      en: [
        'Unlimited products',
        'Unlimited locations',
        'Unlimited users',
        'All Pro features',
        'Integration API',
        'Custom onboarding',
        '24/7 support',
      ],
    },
  },
} as const

export type PlanKey = keyof typeof PLANS
