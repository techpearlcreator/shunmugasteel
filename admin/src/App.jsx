import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedAdmin from './components/auth/ProtectedAdmin'
import AdminLogin from './pages/AdminLogin'

// Admin Pages
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Products from './pages/Products'
import QuoteLogs from './pages/QuoteLogs'
import QuoteDetail from './pages/quotes/QuoteDetail'
import Customers from './pages/Customers'
import Payments from './pages/Payments'
import Settings from './pages/Settings'

export default function App() {
  return (
    <BrowserRouter>
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
          <Route path="payments" element={<Payments />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
