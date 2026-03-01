import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import { LanguageProvider } from '@/hooks/useLanguage'
import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import Layout from '@/components/Layout'
import Dashboard from '@/pages/Dashboard'
import Products from '@/pages/Products'
import Movements from '@/pages/Movements'
import Expiration from '@/pages/Expiration'
import Losses from '@/pages/Losses'
import Reports from '@/pages/Reports'
import Settings from '@/pages/Settings'
import Billing from '@/pages/Billing'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { profile, loading, isDemo } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    )
  }

  // In demo mode, allow access without auth
  if (isDemo) return <>{children}</>

  if (!profile) return <Navigate to="/login" replace />

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/app" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="movements" element={<Movements />} />
        <Route path="expiration" element={<Expiration />} />
        <Route path="losses" element={<Losses />} />
        <Route path="reports" element={<Reports />} />
        <Route path="settings" element={<Settings />} />
        <Route path="billing" element={<Billing />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
