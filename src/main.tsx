import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import App from './App.tsx'
import Layout from './Layout.tsx'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Dapp from './pages/Dapp.tsx'
import Wallet from './pages/Wallet.tsx'

// Solana wallet providers
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import { MyHdWalletAdapter } from './components/MyHdWalletAdapter';
import { Keypair } from '@solana/web3.js';
import { clusterApiUrl } from '@solana/web3.js';
const router = createBrowserRouter(
  createRoutesFromElements( 
    <Route path="/" element={<Layout />}>
      <Route index element={<App />} />
      <Route path="dapp" element={<Dapp/>} />
      <Route path="wallet" element={<Wallet/>} />
    
    </Route>
  )
)

const endpoint = import.meta.env.VITE_SOLANA_RPC_URL || clusterApiUrl('devnet');
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];

// If a local HD seed exists, add the custom HD wallet adapter so it's available globally
try {
  const seedHex = typeof localStorage !== 'undefined' ? localStorage.getItem('mudrax_seed') : null;
  if (seedHex) {
    const seedBuffer = Buffer.from(seedHex, 'hex');
    const derivedSeed = seedBuffer.slice(0, 32);
    const keypair = Keypair.fromSeed(derivedSeed);
    wallets.push(new MyHdWalletAdapter(keypair) as any);
  }
} catch (e) {
  // ignore - localStorage may be unavailable in some environments
  console.warn('Could not initialize HD wallet adapter:', e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <RouterProvider router={router} />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </StrictMode>
)