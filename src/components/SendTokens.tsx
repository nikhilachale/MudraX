import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";

export  default function SendTokens() {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    const [to, setTo] = useState('');
    const [amount, setAmount] = useState('');

    async function sendTokens() {
        if (!publicKey) {
            alert("Please connect your wallet.");
            return;
        }

        if (!to || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            alert("Enter a valid address and amount.");
            return;
        }

        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(to),
                    lamports: Number(amount) * LAMPORTS_PER_SOL,
                })
            );

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, "confirmed");

            alert(`✅ Sent ${amount} SOL to ${to}`);
            setTo('');
            setAmount('');
        } catch (error) {
            console.error("Send failed:", error);
            alert("❌ Failed to send tokens: " + (error as Error).message);
        }
    }

    return (
        <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-6">
                <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                <h2 className="text-2xl font-bold text-white">Send SOL</h2>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-white/70 text-sm font-medium mb-2 text-left">
                        Recipient Address
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Solana wallet address"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="w-full px-6 py-4 rounded-xl text-white bg-black/30 border border-white/20 placeholder-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm text-sm"
                    />
                </div>

                <div>
                    <label className="block text-white/70 text-sm font-medium mb-2 text-left">
                        Amount (SOL)
                    </label>
                    <input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        step="0.01"
                        min="0"
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full px-6 py-4 rounded-xl text-white bg-black/30 border border-white/20 placeholder-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent backdrop-blur-sm"
                    />
                </div>

                {to && amount && (
                    <div className="bg-white/10 rounded-lg p-4 text-left space-y-2">
                        <h4 className="font-semibold text-white">Transaction Preview</h4>
                        <div className="text-sm text-white/70 space-y-1">
                            <div>Amount: <span className="text-white font-medium">{amount} SOL</span></div>
                            <div>To: <span className="text-white font-mono text-xs break-all">{to.slice(0, 8)}...{to.slice(-8)}</span></div>
                            <div>Network Fee: <span className="text-white font-medium">~0.000005 SOL</span></div>
                        </div>
                    </div>
                )}

                <button
                    onClick={sendTokens}
                    disabled={!to || !amount || !publicKey}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
                >
                    {!publicKey ? 'Connect Wallet First' : 'Send SOL'}
                </button>
            </div>
        </div>
    );
}