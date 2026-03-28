import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import ErrorBoundary from './components/ErrorBoundary'

// Pages — lazy loaded (code-split per route)
const Home            = lazy(() => import('./pages/Home'))
const CategoryPage    = lazy(() => import('./pages/CategoryPage'))
const ProductDetail   = lazy(() => import('./pages/ProductDetail'))
const BrandsPage      = lazy(() => import('./pages/BrandsPage'))
const AboutPage       = lazy(() => import('./pages/AboutPage'))
const ContactPage     = lazy(() => import('./pages/ContactPage'))
const LoginPage       = lazy(() => import('./pages/LoginPage'))
const RegisterPage    = lazy(() => import('./pages/RegisterPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage  = lazy(() => import('./pages/ResetPasswordPage'))
const VerifyEmailPage    = lazy(() => import('./pages/VerifyEmailPage'))
const QuoteBasketPage    = lazy(() => import('./pages/QuoteBasketPage'))
const NotFoundPage       = lazy(() => import('./pages/NotFoundPage'))

// Pages — Customer Dashboard
const MyQuotes    = lazy(() => import('./pages/dashboard/MyQuotes'))
const QuoteDetail = lazy(() => import('./pages/dashboard/QuoteDetail'))
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage'))

// Resets ErrorBoundary on every route change via the key prop
function RoutesWithBoundary() {
  const location = useLocation()
  return (
    <ErrorBoundary key={location.key}>
      <Suspense fallback={<div style={{ minHeight: '60vh' }} />}>
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
      </Suspense>
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <RoutesWithBoundary />
    </BrowserRouter>
  )
}
