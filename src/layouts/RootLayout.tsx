import {Outlet} from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';
import {Analytics} from '@vercel/analytics/react';
import {PerformanceProvider} from '@/contexts/PerformanceContext';
import {FirebaseProvider} from '@/contexts/FirebaseContext';
import {ThemeProvider} from '@/contexts/ThemeContext';
import ErrorBoundary from '@components/ErrorBoundary';
import CommandPalette from '@components/CommandPalette';

/**
 * Root layout wrapping all routes.
 * Provides shared contexts (HelmetProvider, PerformanceProvider, FirebaseProvider, ThemeProvider),
 * global UI (CommandPalette, Analytics), and error boundary.
 */
export default function RootLayout() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <ThemeProvider>
          <PerformanceProvider>
            <FirebaseProvider>
              <CommandPalette />
              <Outlet />
              <Analytics />
            </FirebaseProvider>
          </PerformanceProvider>
        </ThemeProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}
