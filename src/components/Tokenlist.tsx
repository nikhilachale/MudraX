import { TOKEN_2022_PROGRAM_ID } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";


interface TokenAccount {
	mint: string;
	amount: string;
	decimals: number;
	uiAmount: number | null;
}

export default function Tokenlist() {
	const { publicKey } = useWallet();
	const { connection } = useConnection();
	const [tokens, setTokens] = useState<TokenAccount[]>([]);
	const [loading, setLoading] = useState(false);
	const [copiedMint, setCopiedMint] = useState<string | null>(null);

	async function getAllTokens() {
		if (!publicKey) {
			console.error("Please connect your wallet first");
			return;
		}

		setLoading(true);
		try {
			const response = await connection.getParsedTokenAccountsByOwner(
				publicKey,
				{
					programId: TOKEN_2022_PROGRAM_ID,
				}
			);

			const tokenAccounts: TokenAccount[] = response.value.map(
				(account) => ({
					mint: account.account.data.parsed.info.mint,
					amount: account.account.data.parsed.info.tokenAmount.amount,
					decimals:
						account.account.data.parsed.info.tokenAmount.decimals,
					uiAmount:
						account.account.data.parsed.info.tokenAmount.uiAmount,
				})
			);

			setTokens(tokenAccounts);

			if (tokenAccounts.length === 0) {
				console.info("No Token-2022 tokens found in your wallet");
			} else {
				console.info(`Found ${tokenAccounts.length} token(s)`);
			}
		} catch (error: any) {
			console.error("Error fetching tokens:", error);
			console.error("Failed to fetch tokens. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	const copyMintAddress = async (mint: string) => {
		try {
			await navigator.clipboard.writeText(mint);
			setCopiedMint(mint);
			setTimeout(() => setCopiedMint(null), 2000);
		} catch (error) {
			console.error("Failed to copy mint address:", error);
		}
	};

	const formatAmount = (amount: string, decimals: number) => {
		const num = parseInt(amount) / Math.pow(10, decimals);
		return num.toLocaleString(undefined, {
			maximumFractionDigits: decimals,
		});
	};

	return (
		<div className="mt-8 space-y-4">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center space-x-3">
					<svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
					</svg>
					<h3 className="text-xl font-bold text-white">My Tokens</h3>
				</div>
				<button
					onClick={getAllTokens}
					disabled={loading || !publicKey}
					className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
				>
					{loading ? (
						<div className="flex items-center gap-2">
							<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
							<span>Loading...</span>
						</div>
					) : (
						"Refresh"
					)}
				</button>
			</div>

			{!publicKey && (
				<div className="text-center text-sm text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
					<svg className="w-6 h-6 text-yellow-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
					</svg>
					Connect your wallet to view your tokens
				</div>
			)}

			{tokens.length === 0 && publicKey && !loading && (
				<div className="text-center py-12">
					<div className="text-6xl mb-4 opacity-50">🪙</div>
					<h4 className="text-lg font-semibold text-white mb-2">No tokens found</h4>
					<p className="text-white/60 text-sm">
						Create your first token using the Token Launchpad above!
					</p>
				</div>
			)}

			{tokens.length > 0 && (
				<div className="space-y-4">
					{tokens.map((token, index) => (
						<div
							key={token.mint}
							className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 hover:shadow-lg"
						>
							<div className="flex justify-between items-start mb-4">
								<div className="flex items-center gap-4">
									<div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
										{index + 1}
									</div>
									<div>
										<h4 className="font-bold text-white text-lg">
											Token #{index + 1}
										</h4>
										<p className="text-sm text-white/60">
											Token-2022 • Custom Token
										</p>
									</div>
								</div>
								<div className="text-right">
									<p className="text-2xl font-bold text-white">
										{token.uiAmount !== null
											? token.uiAmount.toLocaleString()
											: formatAmount(
													token.amount,
													token.decimals
											  )}
									</p>
									<p className="text-sm text-white/60">
										Balance
									</p>
								</div>
							</div>

							<div className="space-y-3">
								<div className="bg-black/20 rounded-lg p-3">
									<div className="flex items-center justify-between mb-2">
										<p className="text-sm font-medium text-white/80">
											Mint Address
										</p>
										<button
											onClick={() => copyMintAddress(token.mint)}
											className="flex items-center gap-1 text-xs px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors"
										>
											{copiedMint === token.mint ? (
												<>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
													</svg>
													Copied!
												</>
											) : (
												<>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
														<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
													</svg>
													Copy
												</>
											)}
										</button>
									</div>
									<code className="text-sm font-mono text-white/70 break-all block">
										{token.mint}
									</code>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div className="bg-black/20 rounded-lg p-3">
										<p className="text-xs text-white/60 mb-1">
											Raw Amount
										</p>
										<p className="font-mono text-sm text-white">
											{parseInt(token.amount).toLocaleString()}
										</p>
									</div>
									<div className="bg-black/20 rounded-lg p-3">
										<p className="text-xs text-white/60 mb-1">
											Decimals
										</p>
										<p className="font-mono text-sm text-white">
											{token.decimals}
										</p>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}