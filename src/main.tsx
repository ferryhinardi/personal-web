import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import PrintResume from './pages/PrintResume'
import ErrorBoundary from './components/ErrorBoundary'
import Loading from './components/ui/loading'
import './index.css'
import './styles/print.css'
import { initWebVitals } from './utils/webVitals'
import { usePWA } from './hooks/usePWA'

// Lazy load AdminDashboard to avoid loading heavy recharts on main bundle
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))

// PWA registration component
function PWAWrapper({ children }: { children: React.ReactNode }) {
  usePWA();
  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <PWAWrapper>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/print" element={<PrintResume />} />
            <Route path="/admin" element={
              <Suspense fallback={<Loading fullScreen message="Loading dashboard..." />}>
                <AdminDashboard />
              </Suspense>
            } />
          </Routes>
        </BrowserRouter>
      </PWAWrapper>
    </ErrorBoundary>
  </React.StrictMode>,
)

// Initialize Web Vitals monitoring
if (import.meta.env.PROD) {
  initWebVitals();
}
