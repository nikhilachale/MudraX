
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

// import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import Airdrop from '../components/Airdrop';
import { ShowSolBalance } from '../components/ShowSolBalance';
import { SignMessage } from '../components/SignMessage';
import SendTokens from '../components/SendTokens';

import { MyHdWalletAdapter } from '../components/MyHdWalletAdapter';
import { Keypair } from '@solana/web3.js';



function Dapp() {
    
// Retrieve seed from localStorage or Wallet.tsx
const seedHex = localStorage.getItem('mudrax_seed');

if (!seedHex) {
    return (
        <div className="px-6 py-8 text-white min-h-screen flex items-center justify-center">
            <div className="text-center space-y-6">
                <div className="text-6xl">🔐</div>
                <h1 className="text-3xl font-bold">No Wallet Found</h1>
                <p className="text-white/70 max-w-md">
                    Please create a wallet first by visiting the HD Wallet page.
                </p>
                <button 
                    onClick={() => window.location.href = '/wallet'}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300"
                >
                    Create Wallet
                </button>
            </div>
        </div>
    );
}

const seedBuffer = Buffer.from(seedHex, 'hex');
const derivedSeed = seedBuffer.slice(0, 32);
const keypair = Keypair.fromSeed(derivedSeed);
const wallets = [new MyHdWalletAdapter(keypair)];
    return (
        <ConnectionProvider endpoint={"https://solana-devnet.g.alchemy.com/v2/G1z10yV2puHx3MU18sTJ6"}>
            <WalletProvider wallets={wallets as any} autoConnect>
                <WalletModalProvider>
                    <div className="px-6 py-8 text-white min-h-screen">
        {/* Header Section */}
        <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
                <svg className="w-12 h-12 text-purple-400" viewBox="0 0 397.7 311.7">
                    <linearGradient id="solana-gradient" gradientUnits="userSpaceOnUse" x1="360.8793" y1="351.4553" x2="141.213" y2="-69.2936" gradientTransform="matrix(1 0 0 -1 0 314)">
                        <stop offset="0" stopColor="#00ffa3"/>
                        <stop offset="1" stopColor="#dc1fff"/>
                    </linearGradient>
                    <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 237.9z" fill="url(#solana-gradient)"/>
                </svg>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                    Solana DApp Console
                </h1>
            </div>
            
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-8 max-w-2xl mx-auto">
                <p className="text-yellow-300 text-sm flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span><strong>Devnet Environment</strong> - Use test SOL for safe experimentation</span>
                </p>
            </div>
            
            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
                Connect your wallet and interact with the Solana blockchain. Request test SOL, send transactions, and sign messages.
            </p>
            
            {/* Wallet Connection Status */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <WalletMultiButton className="!bg-gradient-to-r !from-blue-500 !to-purple-600 !text-white !font-semibold !rounded-xl !px-8 !py-4 !shadow-lg hover:!scale-105 hover:!shadow-2xl !transition-all !duration-300 !border-0" />
                <WalletDisconnectButton className="!bg-white/10 !text-white !px-8 !py-4 !rounded-xl !font-semibold !backdrop-blur-md !border !border-white/20 hover:!bg-white hover:!text-black !transition-all !duration-300" />
            </div>
        </div>                        {/* Main Content Grid */}
                        <div className="max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/15">
                                        <ShowSolBalance />
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/15">
                                        <Airdrop />
                                    </div>
                                </div>
                                
                                {/* Right Column */}
                                <div className="space-y-6">
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/15">
                                        <SendTokens />
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:bg-white/15">
                                        <SignMessage />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default Dapp;