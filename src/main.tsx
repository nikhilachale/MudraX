import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import Layout from './Layout.tsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Dapp from './pages/Dapp.tsx'
import Wallet from './pages/Wallet.tsx'
const router = createBrowserRouter(
  createRoutesFromElements( 
    <Route path="/" element={<Layout />}>
      <Route index element={<App />} />
      <Route path="dapp" element={<Dapp/>} />
      <Route path="wallet" element={<Wallet/>} />
    
    </Route>
  )
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)