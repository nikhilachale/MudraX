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
            await connection.requestAirdrop(
                wallet.publicKey,
                Number(amount) * LAMPORTS_PER_SOL
            );
            alert("✅ Airdropped " + amount + " SOL to " + wallet.publicKey.toBase58());
            setAmount('');
        } catch (error) {
            console.error("Airdrop failed:", error);
            alert("❌ Airdrop failed: " + (error as Error).message);
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Request Airdrop</h2>
            <input
                type="text"
                placeholder="Amount in SOL"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 rounded-lg text-white ring-2 ring-blue-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={requestAirdrop}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-64"
            >
                Request Airdrop
            </button>
        </div>
    );
}