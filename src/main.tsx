import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'  // Corrigé le chemin d'importation

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
