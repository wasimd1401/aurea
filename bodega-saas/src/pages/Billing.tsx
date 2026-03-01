import { useState } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { useAuth } from '@/hooks/useAuth'
import { PLANS, type PlanKey, isStripeConfigured, getStripe } from '@/lib/stripe'
import { CreditCard, CheckCircle2, Crown } from 'lucide-react'

export default function Billing() {
  const { lang } = useLanguage()
  const { organization } = useAuth()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSelectPlan(planKey: PlanKey) {
    if (!isStripeConfigured()) {
      alert(lang === 'es'
        ? 'Stripe no configurado. Agrega las claves de API en .env para activar pagos.'
        : 'Stripe not configured. Add API keys to .env to enable payments.')
      return
    }

    setLoading(planKey)
    try {
      const stripe = await getStripe()
      if (!stripe) throw new Error('Stripe not loaded')

      // In production, you'd call your API to create a checkout session
      // For now, redirect to Stripe checkout with the price ID
      const plan = PLANS[planKey]
      await stripe.redirectToCheckout({
        lineItems: [{ price: plan.priceId, quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/app?billing=success`,
        cancelUrl: `${window.location.origin}/app/billing`,
      })
    } catch (err) {
      console.error('Checkout error:', err)
      alert(lang === 'es' ? 'Error al iniciar pago. Intenta de nuevo.' : 'Payment error. Please try again.')
    }
    setLoading(null)
  }

  const currentPlan = organization?.plan || 'trial'

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-gray-900">
        <CreditCard className="w-6 h-6 inline-block mr-2 text-gray-400" />
        {lang === 'es' ? 'Facturación' : 'Billing'}
      </h1>

      {/* Current plan */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-2">{lang === 'es' ? 'Plan actual' : 'Current plan'}</h2>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold capitalize">{currentPlan}</span>
          <span className="text-sm text-gray-500 capitalize">{organization?.plan_status || 'trialing'}</span>
        </div>
        {organization?.trial_ends_at && organization.plan_status === 'trialing' && (
          <p className="text-sm text-amber-600 mt-2">
            {lang === 'es' ? 'Prueba termina el' : 'Trial ends on'}{' '}
            {new Date(organization.trial_ends_at).toLocaleDateString(lang === 'es' ? 'es-CL' : 'en-US')}
          </p>
        )}
      </div>

      {!isStripeConfigured() && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
          {lang === 'es'
            ? 'Stripe no configurado. Agrega VITE_STRIPE_PUBLISHABLE_KEY en .env para activar pagos reales.'
            : 'Stripe not configured. Add VITE_STRIPE_PUBLISHABLE_KEY in .env to enable real payments.'}
        </div>
      )}

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(([key, plan]) => {
          const isCurrent = currentPlan === key
          const isPro = key === 'pro'
          return (
            <div key={key} className={`relative rounded-2xl border-2 p-6 transition ${
              isCurrent ? 'border-emerald-500 bg-emerald-50/50' :
              isPro ? 'border-emerald-200 bg-white' :
              'border-gray-200 bg-white'
            }`}>
              {isPro && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" /> {lang === 'es' ? 'Recomendado' : 'Recommended'}
                </span>
              )}
              {isCurrent && (
                <span className="absolute -top-3 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {lang === 'es' ? 'Actual' : 'Current'}
                </span>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-extrabold text-gray-900">${plan.price}</span>
                <span className="text-gray-400">/mo</span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features[lang].map(f => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(key)}
                disabled={isCurrent || loading === key}
                className={`w-full py-2.5 rounded-lg text-sm font-semibold transition ${
                  isCurrent
                    ? 'bg-gray-100 text-gray-400 cursor-default'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50'
                }`}
              >
                {loading === key
                  ? (lang === 'es' ? 'Cargando...' : 'Loading...')
                  : isCurrent
                    ? (lang === 'es' ? 'Plan actual' : 'Current plan')
                    : (lang === 'es' ? 'Elegir plan' : 'Choose plan')}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
