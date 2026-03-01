import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Profile, Organization } from '@/lib/types'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  organization: Organization | null
  loading: boolean
  isDemo: boolean
}

interface AuthContextValue extends AuthState {
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, fullName: string, orgName: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// Demo data for when Supabase isn't configured
const DEMO_PROFILE: Profile = {
  id: 'demo-user',
  email: 'demo@bodegacontrol.cl',
  full_name: 'Chef Demo',
  org_id: 'demo-org',
  role: 'owner',
  avatar_url: null,
  created_at: new Date().toISOString(),
}

const DEMO_ORG: Organization = {
  id: 'demo-org',
  name: 'Restaurante Demo',
  slug: 'restaurante-demo',
  plan: 'pro',
  plan_status: 'active',
  stripe_customer_id: null,
  stripe_subscription_id: null,
  trial_ends_at: null,
  max_products: 1000,
  max_users: 10,
  max_locations: 3,
  created_at: new Date().toISOString(),
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    organization: null,
    loading: true,
    isDemo: !isSupabaseConfigured(),
  })

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      // Demo mode — skip auth
      setState(prev => ({ ...prev, loading: false, isDemo: true }))
      return
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id).then(({ profile, organization }) => {
          setState({
            user: session.user,
            session,
            profile,
            organization,
            loading: false,
            isDemo: false,
          })
        })
      } else {
        setState(prev => ({ ...prev, loading: false }))
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { profile, organization } = await fetchProfile(session.user.id)
        setState({
          user: session.user,
          session,
          profile,
          organization,
          loading: false,
          isDemo: false,
        })
      } else {
        setState({
          user: null,
          session: null,
          profile: null,
          organization: null,
          loading: false,
          isDemo: false,
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId: string) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    let organization: Organization | null = null
    if (profile?.org_id) {
      const { data: org } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', profile.org_id)
        .single()
      organization = org as Organization | null
    }

    return { profile: profile as Profile | null, organization }
  }

  async function signIn(email: string, password: string) {
    if (state.isDemo) {
      setState(prev => ({
        ...prev,
        profile: DEMO_PROFILE,
        organization: DEMO_ORG,
      }))
      return { error: null }
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error: error?.message ?? null }
  }

  async function signUp(email: string, password: string, fullName: string, orgName: string) {
    if (state.isDemo) {
      setState(prev => ({
        ...prev,
        profile: { ...DEMO_PROFILE, email, full_name: fullName },
        organization: { ...DEMO_ORG, name: orgName },
      }))
      return { error: null }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, org_name: orgName },
      },
    })
    return { error: error?.message ?? null }
  }

  async function signOut() {
    if (state.isDemo) {
      setState(prev => ({
        ...prev,
        profile: null,
        organization: null,
      }))
      return
    }
    await supabase.auth.signOut()
  }

  async function updateProfile(updates: Partial<Profile>) {
    if (state.isDemo || !state.profile) return
    await supabase
      .from('profiles')
      .update(updates)
      .eq('id', state.profile.id)
    setState(prev => ({
      ...prev,
      profile: prev.profile ? { ...prev.profile, ...updates } : null,
    }))
  }

  return (
    <AuthContext.Provider value={{ ...state, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
