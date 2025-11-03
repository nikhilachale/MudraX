import React, { useState } from "react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
    createInitializeMint2Instruction,
    getMinimumBalanceForRentExemptMint,
} from "@solana/spl-token";

export default function TokenLaunchpad() {
    const { connection } = useConnection();
    const wallet = useWallet();

    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [image, setImage] = useState("");
    const [supply, setSupply] = useState(0);
    const [busy, setBusy] = useState(false);

    async function createToken() {
        try {
            if (!wallet.publicKey) {
                alert("Please connect your wallet first");
                return;
            }

            setBusy(true);

            const mintKeypair = Keypair.generate();
            const lamports = await getMinimumBalanceForRentExemptMint(connection);

            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: MINT_SIZE,
                    lamports,
                    programId: TOKEN_PROGRAM_ID,
                }),
                createInitializeMint2Instruction(
                    mintKeypair.publicKey,
                    9,
                    wallet.publicKey,
                    wallet.publicKey,
                    TOKEN_PROGRAM_ID
                )
            );

            transaction.feePayer = wallet.publicKey;
            const latest = await connection.getLatestBlockhash();
            transaction.recentBlockhash = latest.blockhash;
            transaction.partialSign(mintKeypair);
            const txid = await wallet.sendTransaction(transaction, connection, { signers: [mintKeypair] });
            await connection.confirmTransaction(txid, "confirmed");

            console.log(`✅ Token mint created at: ${mintKeypair.publicKey.toBase58()}`);
            console.log(`View on Solana Explorer: https://explorer.solana.com/tx/${txid}?cluster=devnet`);
            alert(`Token created: ${mintKeypair.publicKey.toBase58()}`);
        } catch (err) {
            console.error("❌ Transaction failed:", err);
            alert("Something went wrong. Check console for details.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
                <svg className="w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
                </svg>
                <h2 className="text-2xl font-bold text-white">Token Launchpad</h2>
            </div>

            <div className=" p-8  text-left">
               
                <div className="space-y-4">
                    <div>
                        <label className="block text-white/70 text-sm mb-2">Token Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Name"
                            className="w-full px-6 py-4 rounded-xl text-white bg-black/30 border border-white/20 placeholder-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-2">Symbol</label>
                        <input
                            value={symbol}
                            onChange={(e) => setSymbol(e.target.value)}
                            placeholder="Symbol (e.g. MUD)"
                            className="w-full px-6 py-4 rounded-xl text-white bg-black/30 border border-white/20 placeholder-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-2">Initial Supply</label>
                        <input
                            value={supply}
                            onChange={(e) => setSupply(Number(e.target.value))}
                            type="number"
                            min={0}
                            placeholder="Initial Supply"
                            className="w-full px-6 py-4 rounded-xl text-white bg-black/30 border border-white/20 placeholder-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div>
                        <label className="block text-white/70 text-sm mb-2">Image URL (optional)</label>
                        <input
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-6 py-4 rounded-xl text-white bg-black/30 border border-white/20 placeholder-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                    <div className="flex items-center justify-end mt-2">
                        <button
                            onClick={createToken}
                            disabled={busy || !wallet.connected}
                            className={`w-full  bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {busy ? 'Creating...' : (wallet.connected ? 'Create Token' : 'Connect Wallet First')}
                        </button>
                    </div>
                </div>

                <p className="mt-4 text-xs text-white/60 text-center select-none">{wallet.connected ? `Wallet: ${wallet.publicKey?.toBase58().slice(0,8)}...` : 'Connect your wallet to create a token'}</p>
            </div>
        </div>
    );
}