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
        <div className="flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Send SOL Tokens</h2>

            <input
                type="text"
                placeholder="Recipient Address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 rounded-lg text-white bg-black/20 ring-2 ring-blue-200 placeholder-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
                type="number"
                placeholder="Amount in SOL"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 rounded-lg text-white bg-black/20 ring-2 ring-blue-200 placeholder-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
                onClick={sendTokens}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-64"
            >
                Send
            </button>
        </div>
    );
}