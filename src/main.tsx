import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import PrintResume from './pages/PrintResume'
import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import './styles/print.css'
import { initWebVitals } from './utils/webVitals'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/print" element={<PrintResume />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)

// Initialize Web Vitals monitoring
if (import.meta.env.PROD) {
  initWebVitals();
}
