
// Generatewallets.tsx
import nacl from 'tweetnacl';
import { Trash } from 'lucide-react';
import { derivePath } from 'ed25519-hd-key';
import { Keypair } from '@solana/web3.js';
import { useState } from 'react';

interface GenerateWalletsProps {
  seed: string;
}

interface Wallet {
  seed: string;
  blockchain: string;
  publickey: string;
  privatekey: string;
}

function Generatewallets({ seed }: GenerateWalletsProps) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [showPrivate, setShowPrivate] = useState(false);

  const generateKeyPair = (seedString: string) => {
    const seedBuffer = Buffer.from(seedString, 'hex');
    const walletIndex = wallets.length;
    const path = `m/44'/501'/${walletIndex}'/0'`;
    const derivedSeed = derivePath(path, seedBuffer.toString('hex')).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    const privateKey = Buffer.from(secret).toString('hex');

    const newWallet: Wallet = {
      seed: seedString,
      blockchain: 'Solana',
      publickey: publicKey,
      privatekey: privateKey,
    };

    setWallets((prev) => [...prev, newWallet]);
  };

  const deleteWallet = (index: number) => {
    setWallets((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="space-y-6">
      <button
        className="w-full bg-white/10 backdrop-blur-lg border border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-black transition duration-300 shadow-lg"
        onClick={() => generateKeyPair(seed)}
      >
        Create Solana Wallet {wallets.length + 1}
      </button>

      <p className="text-center text-sm text-white">Click to generate a wallet from your seed.</p>

      {wallets.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white text-center">Generated Wallets</h3>
          {wallets.map((wallet, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-lg font-semibold text-white">
                  Wallet {index + 1} - {wallet.blockchain}
                </h4>
                <Trash
                  className="cursor-pointer text-red-400 hover:text-red-300"
                  size={20}
                  onClick={() => deleteWallet(index)}
                />
              </div>

              <div>
                <label className="text-white font-semibold">Public Key:</label>
                <p className="text-blue-300 break-all text-sm bg-black/20 p-3 rounded-lg font-mono">
                  {wallet.publickey}
                </p>
              </div>

              <div>
                <label className="text-white font-semibold">Private Key:</label>
                <div className="flex items-center gap-2">
                  <input
                    type={showPrivate ? 'text' : 'password'}
                    value={wallet.privatekey}
                    readOnly
                    className="bg-black/40 text-gray-300 px-3 py-2 rounded-lg w-full break-all text-sm font-mono"
                  />
                  <button
                    className="text-xs bg-white/20 text-white px-3 py-2 rounded-lg hover:bg-white hover:text-black"
                    onClick={() => setShowPrivate((prev) => !prev)}
                  >
                    {showPrivate ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Generatewallets;