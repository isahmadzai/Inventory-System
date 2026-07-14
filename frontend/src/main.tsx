import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from './router'
import { ToastProvider } from '@/components/ui/toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  </StrictMode>,
)
