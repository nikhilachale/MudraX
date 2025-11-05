import React, { useState } from 'react';

import Airdrop from '../components/Airdrop';
import { ShowSolBalance } from '../components/ShowSolBalance';
import { SignMessage } from '../components/SignMessage';
import SendTokens from '../components/SendTokens';
import TokenLaunchpad from '../components/TokenLaunchpad';
import Tokenlist from '../components/Tokenlist';

function Dapp() {
  const seedHex = typeof localStorage !== 'undefined' ? localStorage.getItem('mudrax_seed') : null;

  const [active, setActive] = useState('wallet'); // 'wallet' | 'messages' | 'launchpad' | 'tokens'
  const [collapsed, setCollapsed] = useState(false);

  const NavItem = ({ id, label, icon }: { id: any; label: string; icon: React.ReactNode }) => {
    const isActive = active === id;
    return (
      <button
        onClick={() => setActive(id)}
        className={`group w-full flex items-center gap-3 px-3 py-2 rounded-xl transition 
          ${isActive ? 'bg-white/15 border border-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
      >
        <span className="inline-flex w-5 h-5 items-center justify-center">{icon}</span>
        {!collapsed && <span className="text-sm font-medium">{label}</span>}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-neutral-100 flex">
      {/* Sidebar */}
      <aside
        className={`sticky top-0 h-screen backdrop-blur-md bg-white/5 border-r border-white/10 transition-[width] duration-300
        ${collapsed ? 'w-16' : 'w-64'} flex flex-col`}
      >
        {/* Brand / Toggle */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600" />
            {!collapsed && (
              <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                Solana DApp
              </span>
            )}
          </div>
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            {/* icon: chevrons */}
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              {collapsed ? (
                <path d="M10 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              ) : (
                <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              )}
            </svg>
          </button>
        </div>

        {/* Nav */}
        <nav className="p-3 space-y-2">
          <NavItem
            id="wallet"
            label="Wallet"
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M3 7h15a3 3 0 013 3v4a3 3 0 01-3 3H3V7z" stroke="currentColor" strokeWidth="2" />
                <path d="M3 7V6a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" />
                <circle cx="17" cy="12" r="1.5" fill="currentColor" />
              </svg>
            }
          />
          <NavItem
            id="messages"
            label="Messages"
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M21 15a4 4 0 01-4 4H8l-5 3V7a4 4 0 014-4h10a4 4 0 014 4v8z" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
          />
          <NavItem
            id="launchpad"
            label="Launchpad"
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 19l4-10 5 5 5-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            }
          />
          <NavItem
            id="tokens"
            label="Your Tokens"
            icon={
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
          />
        </nav>

        {/* Seed warning (collapsed-aware) */}
        {!seedHex && (
          <div className="mt-auto p-3">
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-yellow-300 text-xs">
              {!collapsed ? (
                <>
                  No HD seed — go to <a href="/wallet" className="underline">Wallet</a> to create one.
                </>
              ) : (
                <span>⚠️</span>
              )}
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 px-4 md:px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Solana DApp Console
          </h1>
          <p className="text-white/70 max-w-3xl mx-auto text-lg">
            Connect your wallet and interact with the Solana blockchain. Request test SOL, send transactions, mint a token, and sign messages.
          </p>
        </div>

        {/* Sections */}
        {active === 'wallet' && (
          <section className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl hover:bg-white/15 transition">
                <ShowSolBalance />
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl hover:bg-white/15 transition">
                <Airdrop />
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl hover:bg-white/15 transition">
                <SendTokens />
              </div>
            </div>
          </section>
        )}

        {active === 'messages' && (
          <section className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl hover:bg-white/15 transition">
              <SignMessage />
            </div>
          </section>
        )}

        {active === 'launchpad' && (
          <section className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl hover:bg-white/15 transition">
              <TokenLaunchpad />
            </div>
          </section>
        )}

        {active === 'tokens' && (
          <section className="space-y-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl hover:bg-white/15 transition">
              <Tokenlist />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default Dapp;