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

    return <div>
        <p>SOL Balance:</p> 
        <div>
            {loading ? (
                "Loading..."
            ) : wallet.publicKey ? (
                balance !== null ? `${balance.toFixed(4)} SOL` : "Error loading balance"
            ) : (
                "Please connect your wallet"
            )}
        </div>
    </div>
}