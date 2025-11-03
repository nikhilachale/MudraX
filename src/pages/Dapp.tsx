// Wallet providers are initialized globally in `main.tsx` so this page can use hooks directly.

// import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import Airdrop from '../components/Airdrop';
import { ShowSolBalance } from '../components/ShowSolBalance';
import { SignMessage } from '../components/SignMessage';
import SendTokens from '../components/SendTokens';
import TokenLaunchpad from '../components/TokenLaunchpad';



function Dapp() {
    // main UI should match other pages: consistent padding, container width and card styles
    // The global wallet providers are initialized in `main.tsx` so we use wallet hooks in components.

    // Retrieve seed from localStorage (used elsewhere for HD adapter); display an info banner when not present
    const seedHex = typeof localStorage !== 'undefined' ? localStorage.getItem('mudrax_seed') : null;

    return (
        <div className="px-4 py-8 text-neutral-100">
            <main className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        Solana DApp Console
                    </h1>
                    <p className="text-white/70 max-w-3xl mx-auto text-lg">Connect your wallet and interact with the Solana blockchain. Request test SOL, send transactions, mint a token, and sign messages.</p>
                </div>

                {!seedHex && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                        <p className="text-yellow-300 text-sm">No HD wallet seed found — create or import one on the <a href="/wallet" className="underline">Wallet</a> page to enable HD adapter features.</p>
                    </div>
                )}

                {/* Grid: Balance / Airdrop / Send */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl">
                        <ShowSolBalance />
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl">
                        <Airdrop />
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl">
                        <SendTokens />
                    </div>
                </div>

                {/* Grid: SignMessage, TokenLaunchpad */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl">
                        <SignMessage />
                    </div>
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl">
                        <TokenLaunchpad />
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dapp;