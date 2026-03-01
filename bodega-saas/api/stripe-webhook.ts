// Vercel Serverless Function — Stripe Webhook Handler
// Deploy this to Vercel to handle subscription events

import type { VercelRequest, VercelResponse } from '@vercel/node'

export const config = { api: { bodyParser: false } }

async function buffer(req: VercelRequest): Promise<Buffer> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY
  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!STRIPE_SECRET || !WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Stripe not configured' })
  }

  try {
    const body = await buffer(req)
    const sig = req.headers['stripe-signature'] as string

    // Verify webhook signature using Stripe
    const stripe = await import('stripe')
    const stripeClient = new stripe.default(STRIPE_SECRET, { apiVersion: '2024-12-18.acacia' as any })
    const event = stripeClient.webhooks.constructEvent(body, sig, WEBHOOK_SECRET)

    // Plan limits mapping
    const planLimits: Record<string, { max_products: number; max_users: number; max_locations: number }> = {
      starter: { max_products: 100, max_users: 2, max_locations: 1 },
      pro: { max_products: 1000, max_users: 10, max_locations: 3 },
      enterprise: { max_products: 999999, max_users: 999999, max_locations: 999999 },
    }

    // Handle events
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const customerId = session.customer as string
        const subscriptionId = session.subscription as string

        // Get subscription to determine plan
        const subscription = await stripeClient.subscriptions.retrieve(subscriptionId)
        const priceId = subscription.items.data[0]?.price.id

        // Determine plan from price ID
        let plan = 'starter'
        if (priceId === process.env.VITE_STRIPE_PRICE_PRO) plan = 'pro'
        if (priceId === process.env.VITE_STRIPE_PRICE_ENTERPRISE) plan = 'enterprise'

        const limits = planLimits[plan] || planLimits.starter

        // Update organization in Supabase
        if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
          await fetch(`${SUPABASE_URL}/rest/v1/organizations?stripe_customer_id=eq.${customerId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            },
            body: JSON.stringify({
              plan,
              plan_status: 'active',
              stripe_subscription_id: subscriptionId,
              ...limits,
            }),
          })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        const status = subscription.status
        const customerId = subscription.customer

        let planStatus = 'active'
        if (status === 'past_due') planStatus = 'past_due'
        if (status === 'canceled' || status === 'unpaid') planStatus = 'cancelled'

        if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
          await fetch(`${SUPABASE_URL}/rest/v1/organizations?stripe_customer_id=eq.${customerId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            },
            body: JSON.stringify({ plan_status: planStatus }),
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        const customerId = subscription.customer

        if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
          await fetch(`${SUPABASE_URL}/rest/v1/organizations?stripe_customer_id=eq.${customerId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_SERVICE_KEY,
              'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            },
            body: JSON.stringify({
              plan: 'trial',
              plan_status: 'cancelled',
              stripe_subscription_id: null,
            }),
          })
        }
        break
      }
    }

    res.status(200).json({ received: true })
  } catch (err: any) {
    console.error('Webhook error:', err.message)
    res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }
}
