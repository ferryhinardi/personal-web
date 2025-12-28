import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Import legacy CSS files
import './styles/default.css'
import './styles/layout.css'
import './styles/media-queries.css'
import './styles/magnific-popup.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
