import { useState, type ReactElement } from 'react';
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint } from "@solana/spl-token";

export default function TokenLaunchpad(): ReactElement {
    const { connection } = useConnection();
    const wallet = useWallet();

    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [image, setImage] = useState('');
    const [supply, setSupply] = useState('1000000');
    const [isCreating, setIsCreating] = useState(false);

    async function createToken() {
        if (!wallet || !wallet.publicKey) {
            alert('Please connect your wallet first');
            return;
        }

        setIsCreating(true);
        try {
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
                createInitializeMint2Instruction(mintKeypair.publicKey, 9, wallet.publicKey, wallet.publicKey, TOKEN_PROGRAM_ID)
            );

            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            transaction.partialSign(mintKeypair);

            const sig = await wallet.sendTransaction(transaction, connection);
            console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}, sig: ${sig}`);
            alert(`Token created: ${mintKeypair.publicKey.toBase58()}`);
        } catch (err) {
            console.error('Token creation failed', err);
            alert('Token creation failed: ' + ((err as any)?.message || String(err)));
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-4">Token Launchpad</h3>

            <div className="space-y-3">
                <label className="block text-sm text-white/80">Name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Token name"
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-purple-400"
                />

                <label className="block text-sm text-white/80">Symbol</label>
                <input
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    placeholder="Token symbol (e.g. MUD)"
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-purple-400"
                />

                <label className="block text-sm text-white/80">Image URL (optional)</label>
                <input
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-purple-400"
                />

                <label className="block text-sm text-white/80">Initial Supply</label>
                <input
                    value={supply}
                    onChange={(e) => setSupply(e.target.value)}
                    placeholder="1000000"
                    type="number"
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white text-sm outline-none focus:border-purple-400"
                />

                <div className="flex items-center justify-end space-x-3 mt-4">
                    <button
                        onClick={createToken}
                        disabled={isCreating}
                        className="bg-gradient-to-r from-green-500 to-teal-400 text-black font-semibold px-4 py-2 rounded-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
                    >
                        {isCreating ? 'Creating…' : 'Create Token'}
                    </button>
                </div>
            </div>
        </div>
    );
}
