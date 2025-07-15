
import nacl from "tweetnacl";
import { Trash } from 'lucide-react';
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { useState } from "react";

interface GenerateWalletsProps {
  seed: string;
}
interface wallet{
  seed: string;
  blockchain: string;
  publickey: string;
  privatekey: string;
}

function Generatewallets({ seed }: GenerateWalletsProps) {

  const [wallets, setWallets] = useState<wallet[]>([]);
  const [showPrivate, setShowPrivate] = useState<boolean>(false);

  const generatekeyPair = (seedString: string) => {
    // Convert the mnemonic seed to buffer for derivation
    const seedBuffer = Buffer.from(seedString, 'hex');
    const walletIndex = wallets.length; // Use current array length as index
    const path = `m/44'/501'/${walletIndex}'/0'`; // Dynamic path for multiple wallets
    const derivedSeed = derivePath(path, seedBuffer.toString("hex")).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    const privateKey = Buffer.from(secret).toString('hex');
    
    // Create new wallet object
    const newWallet: wallet = {
      seed: seedString,
      blockchain: "Solana",
      publickey: publicKey,
      privatekey: privateKey
    };
    
    // Add to wallets array
    setWallets(prevWallets => [...prevWallets, newWallet]);
    
    console.log(`Wallet ${walletIndex + 1}:`, publicKey);
  }

  const deleteWallet = (indexToDelete: number) => {
    setWallets(prevWallets => prevWallets.filter((_, index) => index !== indexToDelete));
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 mt-10">
  <button
    className="w-full bg-white/10 backdrop-blur-lg border border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-black transition duration-300 shadow-lg"
    onClick={() => generatekeyPair(seed)}
  >
    Create Solana Wallet {wallets.length + 1}
  </button>

  <p className="text-center text-sm text-white">Click the button to generate a new wallet from the provided seed.</p>

  {/* Display all wallets */}
  {wallets.length > 0 && (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white text-center">Generated Wallets</h3>
      {wallets.map((wallet, index) => (
        <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-4">
        <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white">Wallet {index + 1} - {wallet.blockchain}</h4>
            <Trash 
              className="cursor-pointer text-red-400 hover:text-red-300 transition-colors" 
              size={20} 
              onClick={() => deleteWallet(index)}
            />
        </div>
          
          {/* Public Key */}
          <div className="space-y-2">
            <label className="text-white font-semibold">Public Key:</label>
            <p className="text-blue-300 break-all text-sm bg-black/20 p-3 rounded-lg font-mono">{wallet.publickey}</p>
          </div>

          {/* Private Key with toggle */}
          <div className="space-y-2">
            <label className="text-white font-semibold">Private Key:</label>
            <div className="flex items-center gap-2">
              <input
                type={showPrivate ? "text" : "password"}
                value={wallet.privatekey}
                readOnly
                className="bg-black/40 text-gray-300 px-3 py-2 rounded-lg w-full break-all text-sm font-mono"
              />
              <button
                type="button"
                className="text-xs bg-white/20 text-white px-3 py-2 rounded-lg hover:bg-white hover:text-black transition-colors whitespace-nowrap"
                onClick={() => setShowPrivate((prev) => !prev)}
              >
                {showPrivate ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  )
}

export default Generatewallets
