import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import './styles/print.css'
import { initWebVitals } from './utils/webVitals'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
)

// Initialize Web Vitals monitoring
if (import.meta.env.PROD) {
  initWebVitals();
}
