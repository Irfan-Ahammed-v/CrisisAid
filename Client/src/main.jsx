import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import MainRouter from './Router/MainRouter'
import "./index.css"
import { AuthProvider } from './context/AuthContext'

createRoot(document.getElementById('root')).render(
  <AuthProvider>
  <BrowserRouter>
    <MainRouter />
  </BrowserRouter>
  </AuthProvider>
)
