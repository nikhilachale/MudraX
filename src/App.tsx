import { IconWallet } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { Wallet as WalletIconPh, RocketLaunch, Coins } from "phosphor-react";

function App() {
  const navigate = useNavigate();

  return (
    
    <div className="px-4 pt-8 pb-12  bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900  text-neutral-100 min-h-screen flex items-center">
      
      <main className="max-w-6xl mx-auto w-full">
        <div className="text-center space-y-16">
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <IconWallet color="white" stroke={1.2} size={120} className="relative z-10" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Launch your
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent block md:inline md:ml-4">
                Web3 Experience
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
              Create secure HD wallets, manage multiple blockchains, and interact with decentralized applications. 
              Your gateway to the future of finance.
            </p>
          </div>

          {/* Enhanced Feature Cards (updated: Wallet, DApp, Launchpad) */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}">
            {/* Card: Create & Manage Wallet */}
            <div
              onClick={() => navigate('/wallet')}
              className="relative bg-white/4 backdrop-blur-xl border border-white/8 p-8 rounded-3xl group cursor-pointer transition-transform duration-600 hover:-translate-y-3 hover:shadow-2xl overflow-hidden will-change-transform"
              style={{ transitionDelay: `0ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 opacity-0 group-hover:opacity-8 transition-opacity duration-700 rounded-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-start space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-black/50 border border-white/6 flex items-center justify-center shadow-inner">
                    {/* wallet icon (phosphor) */}
                    <WalletIconPh size={28} weight="duotone" className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Create & Manage Wallet</h3>
                    <p className="text-white/60 text-sm">One HD seed to manage Bitcoin, Ethereum & Solana — secure BIP44 derivation.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-white/6 border border-white/8 text-white/80">BIP44</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/6 border border-white/8 text-white/80">Multi-chain</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/6 border border-white/8 text-white/80">Secure</span>
                </div>

                <div className="mt-2">
                  <div className="text-sm text-white/60 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-black/30 border border-white/6">•</span>
                    <span>Generate addresses, view balances, export seed (securely)</span>
                  </div>
                </div>
              </div>

              {/* subtle cyber accent */}
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.015),transparent 30%)] mix-blend-screen opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-3xl"></div>
            </div>

            {/* Card: DApp Console */}
            <div
              onClick={() => navigate('/dapp')}
              className="relative bg-white/4 backdrop-blur-xl border border-white/8 p-8 rounded-3xl group cursor-pointer transition-transform duration-600 hover:-translate-y-3 hover:shadow-2xl overflow-hidden will-change-transform"
              style={{ transitionDelay: `90ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-8 transition-opacity duration-700 rounded-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-start space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-black/50 border border-white/6 flex items-center justify-center shadow-inner">
                    {/* rocket/send icon (phosphor) */}
                    <RocketLaunch size={28} weight="duotone" className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">DApp Console</h3>
                    <p className="text-white/60 text-sm">Connect wallets, request devnet airdrops, send SOL and sign messages.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-white/6 border border-white/8 text-white/80">Send SOL</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/6 border border-white/8 text-white/80">Airdrop</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/6 border border-white/8 text-white/80">Sign</span>
                </div>

                <div className="mt-2">
                  <div className="text-sm text-white/60 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-black/30 border border-white/6">•</span>
                    <span>Devnet testing tools and transaction utilities for builders.</span>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.015),transparent 30%)] mix-blend-screen opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-3xl"></div>
            </div>

            {/* Card: Token Launchpad (slightly highlighted) */}
            <div
              onClick={() => navigate('/dapp')}
              className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl group cursor-pointer transition-transform duration-600 hover:-translate-y-3 hover:shadow-2xl overflow-hidden will-change-transform"
              style={{ transitionDelay: `180ms`, boxShadow: '0 10px 30px rgba(99,102,241,0.06)' }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 opacity-0 group-hover:opacity-12 transition-opacity duration-700 rounded-3xl pointer-events-none"></div>

              <div className="relative z-10 flex flex-col items-start space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center shadow-inner">
                    {/* token icon (phosphor) */}
                    <Coins size={28} weight="duotone" className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">Token Launchpad</h3>
                    <p className="text-white/60 text-sm">Create a professional token with on-chain metadata and initial minting — minimal-pro workflow.</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-3 py-1 rounded-full bg-white/6 border border-white/8 text-white/80">Mint</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/6 border border-white/8 text-white/80">Metadata</span>
                  <span className="text-xs px-3 py-1 rounded-full bg-white/6 border border-white/8 text-white/80">ATA</span>
                </div>

                <div className="mt-2">
                  <div className="text-sm text-white/60 flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-black/30 border border-white/6">•</span>
                    <span>On-chain metadata pointer, initial supply minting, and ATA setup.</span>
                  </div>
                </div>
              </div>

              {/* subtle scanline overlay */}
              <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent 6px,rgba(255,255,255,0.01) 6px)] opacity-0 group-hover:opacity-20 transition-opacity duration-700 rounded-3xl"></div>
            </div>
          </div>

          {/* Quick Start Guide */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">🚀 Quick Start Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-lg">1</div>
                  <h4 className="font-semibold text-white">Create Wallet</h4>
                  <p className="text-white/70 text-sm">Generate a secure HD wallet with 12-word recovery phrase</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-lg">2</div>
                  <h4 className="font-semibold text-white">Add Addresses</h4>
                  <p className="text-white/70 text-sm">Generate multiple addresses for Bitcoin, Ethereum, and Solana</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-lg">3</div>
                  <h4 className="font-semibold text-white">Use DApps</h4>
                  <p className="text-white/70 text-sm">Connect to DApps and start transacting on Solana</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button
              onClick={() => navigate('/wallet')}
              className="group relative bg-white/10 backdrop-blur-lg border border-white/30 text-white font-semibold py-5 px-12 rounded-2xl hover:bg-white hover:text-black transition-all duration-500 shadow-xl transform hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Launch HD Wallet</span>
              </span>
            </button>

            <button
              onClick={() => navigate('/dapp')}
              className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-5 px-12 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-500 shadow-xl transform hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Launch DApp Console</span>
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;