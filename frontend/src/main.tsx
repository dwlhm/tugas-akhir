import React from 'react'
import ReactDOM from 'react-dom/client'
import "@fontsource/open-sans"; // Defaults to weight 400.
import App from './App.tsx'
import "./utils/reset.css"
import "./index.css"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
