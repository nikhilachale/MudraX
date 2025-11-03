import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useState } from 'react';

export default function Airdrop() {
    const wallet = useWallet();
    const { connection } = useConnection();
    const [amount, setAmount] = useState('');

  async function requestAirdrop() {
    if (!wallet.publicKey) {
        alert("Please connect your wallet first");
        return;
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        alert("Please enter a valid amount");
        return;
    }

    try {
        // Use official devnet faucet
        const faucet = new (connection.constructor as any)("https://api.devnet.solana.com");
        await faucet.requestAirdrop(wallet.publicKey, Number(amount) * LAMPORTS_PER_SOL);

        alert("✅ Airdropped " + amount + " SOL to " + wallet.publicKey.toBase58());
        setAmount('');
    } catch (error) {
        console.error("Airdrop failed:", error);
        alert("❌ Airdrop failed: " + (error as Error).message);
    }
}

    return (
        <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-6">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <h2 className="text-2xl font-bold text-white">Request Airdrop</h2>
            </div>
            
            <div className="space-y-4">
               
                
                <div className="space-y-3">
                    <input
                        type="number"
                        placeholder="Amount in SOL (max 5)"
                        value={amount}
                        max="5"
                        step="0.1"
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-6 py-4 rounded-xl text-white bg-black/30 border border-white/20 placeholder-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                    />
                    
                    <div className="grid grid-cols-3 gap-2">
                        {[0.5, 1, 2].map((preset) => (
                            <button
                                key={preset}
                                onClick={() => setAmount(preset.toString())}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm py-2 px-3 rounded-lg transition-all duration-200"
                            >
                                {preset} SOL
                            </button>
                        ))}
                    </div>
                </div>
                
                <button
                    onClick={requestAirdrop}
                    disabled={!amount || !wallet.publicKey}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                    {wallet.publicKey ? 'Request Airdrop' : 'Connect Wallet First'}
                </button>
            </div>
        </div>
    );
}