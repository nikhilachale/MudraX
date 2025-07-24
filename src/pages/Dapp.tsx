
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import Airdrop from '../components/Airdrop';
import { ShowSolBalance } from '../components/ShowSolBalance';
import { SignMessage } from '../components/SignMessage';
import SendTokens from '../components/SendTokens';



function Dapp() {
    const wallets = [new PhantomWalletAdapter()];

    return (
        <ConnectionProvider endpoint={"https://solana-devnet.g.alchemy.com/v2/G1z10yV2puHx3MU18sTJ6"}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <div className="min-h-screen px-6 py-10 text-white bg-gradient-to-tr from-slate-900 via-blue-900 to-slate-800 animate-gradient">
                        {/* Animated Background with blur and scaling */}
                        <div className="flex flex-col items-center space-y-6">
                            <div className="flex gap-4">
                                <WalletMultiButton className="!bg-gradient-to-r !from-blue-500 !to-indigo-600 !text-white !font-semibold !rounded-xl !px-6 !py-3 !shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300" />
                                <WalletDisconnectButton className="!bg-white/20 !text-white !px-6 !py-3 !rounded-xl !font-semibold hover:bg-white hover:text-black transition-all duration-300" />
                            </div>

                            <div className="w-full max-w-2xl space-y-6 mt-10">
                                <div className="w-full max-w-2xl space-y-6 mt-10">
                                    <div className="p-6 rounded-2xl backdrop-blur-md bg-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <Airdrop />
                                    </div>
                                    <div className="p-6 rounded-2xl backdrop-blur-md bg-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <ShowSolBalance />
                                    </div>
                                    <div className="p-6 rounded-2xl backdrop-blur-md bg-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <SignMessage />
                                    </div>
                                    <div className="p-6 rounded-2xl backdrop-blur-md bg-white/10 shadow-lg hover:shadow-xl transition-all duration-300">
                                        <SendTokens />
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