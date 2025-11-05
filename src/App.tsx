import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet as WalletIconPh,
  RocketLaunch,
  Coins,
} from 'phosphor-react';

function App() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -top-48 -left-32 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl"></div>
        <div className="absolute top-1/3 -right-40 h-[28rem] w-[28rem] rounded-full bg-purple-600/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/20 blur-3xl"></div>
      </div>

      <div className="relative px-6 pb-16 pt-12 sm:px-8 lg:px-12">
        
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent sm:text-5xl lg:text-6xl">
            MudraX
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/70">
            The all-in-one Solana dev toolkit for HD wallets, DApp testing, and SPL token launches.
          </p>
        </div>

        <main className="mx-auto mt-12 flex max-w-6xl flex-col gap-16">
       

          <section className={`grid gap-8 transition duration-700 ${ready ? 'opacity-100 translate-y-0' : 'translate-y-6 opacity-0'} lg:grid-cols-3`}>
            {[
              {
                icon: <WalletIconPh size={28} color='blue' weight="duotone" />,
                title: 'HD Wallet Orchestration',
                text: 'Generate, manage, and export multi-chain wallets backed by BIP44 derivation paths and pristine UX.',
                accent: 'from-blue-500/20 to-purple-500/20',
                action: () => navigate('/wallet'),
              },
              {
                icon: <RocketLaunch size={28} weight="duotone" />,
                title: 'DApp Execution Console',
                text: 'Send SOL, request airdrops, and sign devnet payloads within a cohesive console ready for demos.',
                accent: 'from-emerald-500/20 to-cyan-500/20',
                action: () => navigate('/dapp'),
              },
              {
                icon: <Coins size={28} color='yellow' weight="duotone" />,
                title: 'Token Launchpad',
                text: 'Spin up SPL tokens with metadata, initial supply minting, and ATA creation baked in.',
                accent: 'from-indigo-500/20 to-violet-500/20',
                action: () => navigate('/dapp'),
              },
            ].map((card, idx) => (
              <button
                key={card.title}
                onClick={card.action}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-left transition-transform duration-500 hover:-translate-y-2 hover:border-white/30"
                style={{ transitionDelay: `${idx * 70}ms` }}
              >
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent} opacity-0 transition group-hover:opacity-60`}></div>
                <div className="relative flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white/90 shadow-inner">
                      {card.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  </div>
                  <p className="text-sm text-white/70">{card.text}</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-white/80 transition group-hover:gap-3">
                    Explore
                    <span className="text-white/60">→</span>
                  </div>
                </div>
              </button>
            ))}
          </section>

          <section className="grid gap-10 rounded-[2.5rem] border border-white/10 bg-white/5 p-10 backdrop-blur-3xl lg:grid-cols-[1fr,1.1fr]">
            <div className="space-y-6">
              <h3 className="text-3xl font-semibold text-white">Zero to demo-ready in three moves.</h3>
              <p className="text-white/70">
                With curated flows, MudraX trims the rough edges around wallet creation, Solana devnet testing, and SPL token launch. Ship a polished prototype without diving into low-level clients.
              </p>
              <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em] text-white/40">
                <span className="rounded-full border border-white/10 px-4 py-2">BIP44</span>
                <span className="rounded-full border border-white/10 px-4 py-2">SPL</span>
                <span className="rounded-full border border-white/10 px-4 py-2">Devnet</span>
                <span className="rounded-full border border-white/10 px-4 py-2">TypeScript</span>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  number: '01',
                  title: 'Initialize HD wallet',
                  desc: 'Generate a 12-word recovery phrase and BIP44 accounts for Solana, Ethereum, and Bitcoin in seconds.',
                },
                {
                  number: '02',
                  title: 'Test inside the console',
                  desc: 'Claim devnet SOL, transfer tokens, and sign payloads with built-in feedback states and analytics.',
                },
                {
                  number: '03',
                  title: 'Ship your token',
                  desc: 'Configure metadata, mint supply, and auto-create ATA for distribution-ready tokens.',
                },
              ].map((step) => (
                <div key={step.number} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-6">
                  <span className="text-sm font-semibold text-white/50">{step.number}</span>
                  <h4 className="text-lg font-semibold text-white">{step.title}</h4>
                  <p className="text-sm text-white/70">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          
        </main>
      </div>
    </div>
  );
}

export default App;