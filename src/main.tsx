import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import App from './App';
import PrintResume from './pages/PrintResume';
import RootLayout from './layouts/RootLayout';
import Loading from './components/ui/loading';
import './i18n/config'; // Initialize i18n before rendering
import './index.css';
import './styles/print.css';
import {initWebVitals} from './utils/webVitals';
import {usePWA} from './hooks/usePWA';

// Lazy load pages to avoid loading them in the main bundle
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const GuestbookPage = lazy(() => import('./pages/GuestbookPage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const UsesPage = lazy(() => import('./pages/UsesPage'));
const ChangelogPage = lazy(() => import('./pages/ChangelogPage'));
const LinksPage = lazy(() => import('./pages/LinksPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// PWA registration component
function PWAWrapper({children}: {children: React.ReactNode}) {
  usePWA();
  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PWAWrapper>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            {/* Home - single-page with all sections */}
            <Route path="/" element={<App />} />

            {/* Print-optimized resume */}
            <Route path="/print" element={<PrintResume />} />

            {/* Admin dashboard */}
            <Route
              path="/admin"
              element={
                <Suspense
                  fallback={
                    <Loading fullScreen message="Loading dashboard..." />
                  }
                >
                  <AdminDashboard />
                </Suspense>
              }
            />

            {/* New pages (lazy-loaded) */}
            <Route
              path="/dashboard"
              element={
                <Suspense
                  fallback={<Loading fullScreen message="Loading..." />}
                >
                  <DashboardPage />
                </Suspense>
              }
            />
            <Route
              path="/guestbook"
              element={
                <Suspense
                  fallback={<Loading fullScreen message="Loading..." />}
                >
                  <GuestbookPage />
                </Suspense>
              }
            />
            <Route
              path="/achievements"
              element={
                <Suspense
                  fallback={<Loading fullScreen message="Loading..." />}
                >
                  <AchievementsPage />
                </Suspense>
              }
            />
            <Route
              path="/uses"
              element={
                <Suspense
                  fallback={<Loading fullScreen message="Loading..." />}
                >
                  <UsesPage />
                </Suspense>
              }
            />
            <Route
              path="/changelog"
              element={
                <Suspense
                  fallback={<Loading fullScreen message="Loading..." />}
                >
                  <ChangelogPage />
                </Suspense>
              }
            />
            <Route
              path="/links"
              element={
                <Suspense
                  fallback={<Loading fullScreen message="Loading..." />}
                >
                  <LinksPage />
                </Suspense>
              }
            />

            {/* 404 catch-all */}
            <Route
              path="*"
              element={
                <Suspense
                  fallback={<Loading fullScreen message="Loading..." />}
                >
                  <NotFoundPage />
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </PWAWrapper>
  </React.StrictMode>,
);

// Initialize Web Vitals monitoring
if (import.meta.env.PROD) {
  initWebVitals();
}
