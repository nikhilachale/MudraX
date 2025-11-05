import {
	createAssociatedTokenAccountInstruction,
	createInitializeMetadataPointerInstruction,
	createInitializeMintInstruction,
	createMintToInstruction,
	ExtensionType,
	getAssociatedTokenAddress,
	getMintLen,
	LENGTH_SIZE,
	TOKEN_2022_PROGRAM_ID,
	TYPE_SIZE,
} from "@solana/spl-token";
import {
	createInitializeInstruction as createInitializeMetadataInstruction,
	pack,
	type TokenMetadata,
} from "@solana/spl-token-metadata";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";


export default function TokenLaunchpad() {
	const [loading, setLoading] = useState(false);
	const [name, setName] = useState("");
	const [symbol, setSymbol] = useState("");
	const [image, setImage] = useState("");
	const [supply, setSupply] = useState(100);

	const { connection } = useConnection();
	const { publicKey, signTransaction } = useWallet();

	async function createToken() {
		if (!publicKey || !signTransaction) {
			alert("Please connect your wallet first");
			return;
		}

		setLoading(true);

		try {
			const mintKeypair = Keypair.generate();
			const metadata: TokenMetadata = {
				updateAuthority: publicKey,
				mint: mintKeypair.publicKey,
				name: name,
				symbol: symbol,
				uri: "https://nikhilachale.github.io/Coin-metadata/data.json",
				additionalMetadata: [
					[
						"description",
						`${name} - Created with Solana Token Creator`,
					],
					["icon", image || "default"],
				],
			};

			const extensions = [ExtensionType.MetadataPointer];
			const mintLen = getMintLen(extensions);
			const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;
			const totalSpace = mintLen + metadataLen;
			const lamports = await connection.getMinimumBalanceForRentExemption(
				totalSpace
			);

			const createMintAccountIx = SystemProgram.createAccount({
				fromPubkey: publicKey,
				newAccountPubkey: mintKeypair.publicKey,
				space: mintLen,
				lamports,
				programId: TOKEN_2022_PROGRAM_ID,
			});

			const initMetadataPointerIx =
				createInitializeMetadataPointerInstruction(
					mintKeypair.publicKey,
					publicKey,
					mintKeypair.publicKey,
					TOKEN_2022_PROGRAM_ID
				);

			const initMintIx = createInitializeMintInstruction(
				mintKeypair.publicKey,
				9,
				publicKey,
				null,
				TOKEN_2022_PROGRAM_ID
			);

			const initMetaIx = createInitializeMetadataInstruction({
				metadata: mintKeypair.publicKey,
				updateAuthority: metadata.updateAuthority!,
				mint: metadata.mint,
				mintAuthority: publicKey,
				name: metadata.name,
				symbol: metadata.symbol,
				uri: metadata.uri,
				programId: TOKEN_2022_PROGRAM_ID,
			});

			const tokenAccount = await getAssociatedTokenAddress(
				mintKeypair.publicKey,
				publicKey,
				false,
				TOKEN_2022_PROGRAM_ID
			);

			const createTokenAccountIx =
				createAssociatedTokenAccountInstruction(
					publicKey,
					tokenAccount,
					publicKey,
					mintKeypair.publicKey,
					TOKEN_2022_PROGRAM_ID
				);

			const initialSupply = supply * Math.pow(10, 9);
			const mintToIx = createMintToInstruction(
				mintKeypair.publicKey,
				tokenAccount,
				publicKey,
				initialSupply,
				[],
				TOKEN_2022_PROGRAM_ID
			);

			const tx = new Transaction().add(
				createMintAccountIx,
				initMetadataPointerIx,
				initMintIx,
				initMetaIx,
				createTokenAccountIx,
				mintToIx
			);

			tx.feePayer = publicKey;
			tx.recentBlockhash = (
				await connection.getLatestBlockhash()
			).blockhash;
			tx.partialSign(mintKeypair);

			const signedTx = await signTransaction(tx);
			const txid = await connection.sendRawTransaction(
				signedTx.serialize()
			);

			const latestBlockhash = await connection.getLatestBlockhash();
			await connection.confirmTransaction(
				{
					signature: txid,
					blockhash: latestBlockhash.blockhash,
					lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
				},
				"confirmed"
			);

			console.log("Token created successfully!");
			console.log("Mint address:", mintKeypair.publicKey.toString());
			console.log("Token account:", tokenAccount.toString());
			console.log("Transaction ID:", txid);

			// Reset form
			setName("");
			setSymbol("");
			setSupply(100);
			setImage("");
		} catch (error: any) {
			console.error("Token creation error:", error);
			console.error(
				error.message || "Failed to create token. Please try again."
			);
		} finally {
			setLoading(false);
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

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 text-left">
               
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
                            disabled={loading || !publicKey}
                            className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? 'Creating...' : (publicKey ? 'Create Token' : 'Connect Wallet First')}
                        </button>
                    </div>
                </div>

                <p className="mt-4 text-xs text-white/60 text-center select-none">{publicKey ? `Wallet: ${publicKey.toBase58().slice(0,8)}...` : 'Connect your wallet to create a token'}</p>
            </div>
        </div>
	);
}