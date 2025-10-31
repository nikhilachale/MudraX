import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState, useEffect } from "react";

export function ShowSolBalance() {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    async function getBalance() { 
        if (wallet.publicKey) {
            setLoading(true);
            try {
                const balance = await connection.getBalance(wallet.publicKey);
                setBalance(balance / LAMPORTS_PER_SOL);
            } catch (error) {
                console.error("Error fetching balance:", error);
                setBalance(null);
            } finally {
                setLoading(false);
            }
        } else {
            setBalance(null);
        }
    }
    
    useEffect(() => {
        getBalance();
    }, [wallet.publicKey, connection]);

    return (
        <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-6">
                <svg className="w-8 h-8 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <h2 className="text-2xl font-bold text-white">Wallet Balance</h2>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-400"></div>
                        <span className="text-white/70">Loading balance...</span>
                    </div>
                ) : wallet.publicKey ? (
                    balance !== null ? (
                        <div className="space-y-2">
                            <div className="text-4xl font-bold text-white">{balance.toFixed(4)}</div>
                            <div className="text-purple-400 font-medium text-lg">SOL</div>
                            <div className="text-white/50 text-sm">≈ ${(balance * 20).toFixed(2)} USD</div>
                        </div>
                    ) : (
                        <div className="text-red-400 font-medium">Error loading balance</div>
                    )
                ) : (
                    <div className="text-white/70 font-medium">Connect your wallet to view balance</div>
                )}
            </div>
            
            {wallet.publicKey && (
                <button
                    onClick={getBalance}
                    disabled={loading}
                    className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 text-white font-medium py-2 px-6 rounded-lg transition-all duration-300 disabled:opacity-50"
                >
                    {loading ? 'Refreshing...' : 'Refresh Balance'}
                </button>
            )}
        </div>
    )
}