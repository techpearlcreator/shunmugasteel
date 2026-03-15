import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

// Pages — Public
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ProductDetail from './pages/ProductDetail'
import BrandsPage from './pages/BrandsPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import QuoteBasketPage from './pages/QuoteBasketPage'
import NotFoundPage from './pages/NotFoundPage'

// Pages — Customer Dashboard
import MyQuotes from './pages/dashboard/MyQuotes'
import QuoteDetail from './pages/dashboard/QuoteDetail'
import ProfilePage from './pages/dashboard/ProfilePage'

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="products/:categorySlug" element={<CategoryPage />} />
            <Route path="product/:productSlug" element={<ProductDetail />} />
            <Route path="brands" element={<BrandsPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password" element={<ResetPasswordPage />} />
            <Route path="verify-email" element={<VerifyEmailPage />} />
            <Route path="quote-basket" element={<QuoteBasketPage />} />
            <Route path="my-quotes" element={<ProtectedRoute><MyQuotes /></ProtectedRoute>} />
            <Route path="my-quotes/:id" element={<ProtectedRoute><QuoteDetail /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
