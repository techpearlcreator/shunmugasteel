import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedAdmin from './components/auth/ProtectedAdmin'
import AdminLogin from './pages/AdminLogin'

// Admin Pages — lazy loaded (code-split per route)
const Dashboard   = lazy(() => import('./pages/Dashboard'))
const Categories  = lazy(() => import('./pages/Categories'))
const Products    = lazy(() => import('./pages/Products'))
const QuoteLogs   = lazy(() => import('./pages/QuoteLogs'))
const QuoteDetail = lazy(() => import('./pages/quotes/QuoteDetail'))
const Customers   = lazy(() => import('./pages/Customers'))
const Settings    = lazy(() => import('./pages/Settings'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
        <Routes>
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/" element={<ProtectedAdmin><AdminLayout /></ProtectedAdmin>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="categories" element={<Categories />} />
            <Route path="products" element={<Products />} />
            <Route path="quotes" element={<QuoteLogs />} />
            <Route path="quotes/:id" element={<QuoteDetail />} />
            <Route path="customers" element={<Customers />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
