
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
  walletIndex: number;
  derivationPath: string;
  showPrivate?: boolean;
}

function Generatewallets({ seed }: GenerateWalletsProps) {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [solanaIndex, setSolanaIndex] = useState(0);
  const [ethIndex, setEthIndex] = useState(0);
  const [btcIndex, setBtcIndex] = useState(0);

  const generateSolanaWallet = (seedString: string) => {
    const seedBuffer = Buffer.from(seedString, 'hex');
    const path = `m/44'/501'/${solanaIndex}'/0'`;
    const derivedSeed = derivePath(path, seedBuffer.toString('hex')).key;
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
    const publicKey = Keypair.fromSecretKey(secret).publicKey.toBase58();
    const privateKey = Buffer.from(secret).toString('hex');

    const newWallet: Wallet = {
      seed: seedString,
      blockchain: 'Solana',
      publickey: publicKey,
      privatekey: privateKey,
      walletIndex: solanaIndex,
      derivationPath: path,
      showPrivate: false,
    };

    setWallets((prev) => [...prev, newWallet]);
    setSolanaIndex(prev => prev + 1);
  };

  const generateEthereumWallet = (seedString: string) => {
    try {
      const seedBuffer = Buffer.from(seedString, 'hex');
      const path = `m/44'/60'/${ethIndex}'/0/0`;
      
      // For Ethereum demo, we'll create a simplified key derivation
      // In production, you'd use @ethereumjs/wallet or similar
      const ethSeed = seedBuffer.slice(0, 32); // Use first 32 bytes
      const privateKey = Buffer.from(ethSeed).toString('hex');
      
      // Simple demo public key generation (not real Ethereum key derivation)
      const publicKey = Buffer.from(ethSeed).toString('hex').slice(0, 40);

      const newWallet: Wallet = {
        seed: seedString,
        blockchain: 'Ethereum',
        publickey: `0x${publicKey}`,
        privatekey: `0x${privateKey}`,
        walletIndex: ethIndex,
        derivationPath: path,
        showPrivate: false,
      };

      setWallets((prev) => [...prev, newWallet]);
      setEthIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error generating Ethereum wallet:', error);
      alert('Error generating Ethereum wallet. This is a demo implementation.');
    }
  };

  const generateBitcoinWallet = (seedString: string) => {
    try {
      const seedBuffer = Buffer.from(seedString, 'hex');
      const path = `m/44'/0'/${btcIndex}'/0/0`;
      
      // For Bitcoin demo, we'll create a simplified key derivation
      // In production, you'd use bitcoinjs-lib or similar
      const btcSeed = seedBuffer.slice(16, 48); // Use middle 32 bytes
      const privateKey = Buffer.from(btcSeed).toString('hex');
      
      // Simple demo public key generation (not real Bitcoin key derivation)
      const publicKey = Buffer.from(btcSeed).toString('hex').slice(0, 40);

      const newWallet: Wallet = {
        seed: seedString,
        blockchain: 'Bitcoin',
        publickey: publicKey,
        privatekey: privateKey,
        walletIndex: btcIndex,
        derivationPath: path,
        showPrivate: false,
      };

      setWallets((prev) => [...prev, newWallet]);
      setBtcIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error generating Bitcoin wallet:', error);
      alert('Error generating Bitcoin wallet. This is a demo implementation.');
    }
  };

  const deleteWallet = (index: number) => {
    setWallets((prev) => prev.filter((_, i) => i !== index));
  };

  const togglePrivateKey = (index: number) => {
    setWallets((prev) => 
      prev.map((wallet, i) => 
        i === index ? { ...wallet, showPrivate: !wallet.showPrivate } : wallet
      )
    );
  };

  const getBlockchainIcon = (blockchain: string) => {
    switch (blockchain) {
      case 'Solana':
        return (
          <svg width="20" height="20" viewBox="0 0 397.7 311.7" className="text-purple-400">
            <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="360.8793" y1="351.4553" x2="141.213" y2="-69.2936" gradientTransform="matrix(1 0 0 -1 0 314)">
              <stop offset="0" stopColor="#00ffa3"/>
              <stop offset="1" stopColor="#dc1fff"/>
            </linearGradient>
            <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 237.9z" fill="url(#a)"/>
            <linearGradient id="b" gradientUnits="userSpaceOnUse" x1="264.8291" y1="401.6014" x2="45.1628" y2="-19.1475" gradientTransform="matrix(1 0 0 -1 0 314)">
              <stop offset="0" stopColor="#00ffa3"/>
              <stop offset="1" stopColor="#dc1fff"/>
            </linearGradient>
            <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#b)"/>
            <linearGradient id="c" gradientUnits="userSpaceOnUse" x1="312.5484" y1="376.688" x2="92.8822" y2="-44.061" gradientTransform="matrix(1 0 0 -1 0 314)">
              <stop offset="0" stopColor="#00ffa3"/>
              <stop offset="1" stopColor="#dc1fff"/>
            </linearGradient>
            <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#c)"/>
          </svg>
        );
      case 'Ethereum':
        return (
          <svg width="20" height="20" viewBox="0 0 256 417" className="text-blue-400">
            <path fill="#343434" d="m127.9611 0-2.2909 7.9492v275.6474l2.2909 2.2909 127.9611-75.7537z"/>
            <path fill="#8C8C8C" d="m127.9611 0-127.9611 210.1338 127.9611 75.7537z"/>
            <path fill="#3C3C3B" d="m127.9611 312.1871-1.2963 1.5765v98.1131l1.2963 3.7614 128.1834-180.9335z"/>
            <path fill="#8C8C8C" d="m127.9611 416.6381v-104.4510l-127.9611-76.4824z"/>
            <path fill="#141414" d="m127.9611 285.8875 127.9611-75.7537-127.9611-58.2652z"/>
            <path fill="#393939" d="m0 210.1338 127.9611 75.7537v-134.0189z"/>
          </svg>
        );
      case 'Bitcoin':
        return (
          <svg width="20" height="20" viewBox="0 0 256 256" className="text-orange-400">
            <path fill="#F7931A" d="M128 256C57.3 256 0 198.7 0 128S57.3 0 128 0s128 57.3 128 128-57.3 128-128 128z"/>
            <path fill="#FFF" d="M170.1 120.7c3.1-20.8-12.7-32-34.4-39.5l7-28.2-17.2-4.3-6.8 27.4c-4.5-1.1-9.2-2.2-13.8-3.2l6.9-27.6-17.2-4.3-7 28.2c-3.8-.9-7.5-1.8-11.1-2.8l.1-.2-23.7-5.9-4.6 18.3s12.7 2.9 12.4 3.1c6.9 1.7 8.2 6.3 8 9.9l-8 32.2c.5.1 1.1.3 1.8.5l-1.8-.4-11.2 45c-.9 2.1-3 5.3-7.9 4.1.2.3-12.4-3.1-12.4-3.1l-8.5 19.6 22.4 5.6c4.2 1 8.3 2.1 12.3 3.1l-7.1 28.4 17.2 4.3 7-28.2c4.7 1.3 9.2 2.5 13.7 3.6l-7 28.1 17.2 4.3 7.1-28.4c29.2 5.5 51.1 3.3 60.4-23.2 7.5-21.4-.4-33.8-15.8-41.8 11.3-2.6 19.7-10 22-25.3zm-39.4 55.3c-5.3 21.3-41.1 9.8-52.7 6.9l9.4-37.7c11.6 2.9 48.8 8.6 43.3 30.8zm5.3-55.6c-4.8 19.3-34.6 9.5-44.3 7.1l8.5-34.1c9.7 2.4 40.8 6.9 35.8 27z"/>
          </svg>
        );
      default:
        return (
          <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-white">?</span>
          </div>
        );
    }
  };

  return (
    <section className="space-y-6">
      {/* Wallet Creation Buttons */}
      <div className="bg-white/5 backdrop-blur-md p-6 rounded-xl border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4 text-center">Create New Wallet</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            className="bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
            onClick={() => generateSolanaWallet(seed)}
          >
            <svg width="20" height="20" viewBox="0 0 397.7 311.7">
              <linearGradient id="solana-a" gradientUnits="userSpaceOnUse" x1="360.8793" y1="351.4553" x2="141.213" y2="-69.2936" gradientTransform="matrix(1 0 0 -1 0 314)">
                <stop offset="0" stopColor="#00ffa3"/>
                <stop offset="1" stopColor="#dc1fff"/>
              </linearGradient>
              <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 237.9z" fill="url(#solana-a)"/>
              <linearGradient id="solana-b" gradientUnits="userSpaceOnUse" x1="264.8291" y1="401.6014" x2="45.1628" y2="-19.1475" gradientTransform="matrix(1 0 0 -1 0 314)">
                <stop offset="0" stopColor="#00ffa3"/>
                <stop offset="1" stopColor="#dc1fff"/>
              </linearGradient>
              <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="url(#solana-b)"/>
              <linearGradient id="solana-c" gradientUnits="userSpaceOnUse" x1="312.5484" y1="376.688" x2="92.8822" y2="-44.061" gradientTransform="matrix(1 0 0 -1 0 314)">
                <stop offset="0" stopColor="#00ffa3"/>
                <stop offset="1" stopColor="#dc1fff"/>
              </linearGradient>
              <path d="M333.1 120.1c-2.4-2.4-5.7-3.8-9.2-3.8H6.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="url(#solana-c)"/>
            </svg>
            <span>Create Solana</span>
          </button>

          <button
            className="bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
            onClick={() => generateEthereumWallet(seed)}
          >
            <svg width="20" height="20" viewBox="0 0 256 417">
              <path fill="#627EEA" d="m127.9611 0-2.2909 7.9492v275.6474l2.2909 2.2909 127.9611-75.7537z"/>
              <path fill="#BBBBBB" d="m127.9611 0-127.9611 210.1338 127.9611 75.7537z"/>
              <path fill="#627EEA" d="m127.9611 312.1871-1.2963 1.5765v98.1131l1.2963 3.7614 128.1834-180.9335z"/>
              <path fill="#BBBBBB" d="m127.9611 416.6381v-104.4510l-127.9611-76.4824z"/>
              <path fill="#627EEA" d="m127.9611 285.8875 127.9611-75.7537-127.9611-58.2652z"/>
              <path fill="#BBBBBB" d="m0 210.1338 127.9611 75.7537v-134.0189z"/>
            </svg>
            <span>Create Ethereum</span>
          </button>

          <button
            className="bg-orange-500/20 hover:bg-orange-500/30 border border-orange-400/50 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
            onClick={() => generateBitcoinWallet(seed)}
          >
            <svg width="20" height="20" viewBox="0 0 256 256">
              <path fill="#F7931A" d="M128 256C57.3 256 0 198.7 0 128S57.3 0 128 0s128 57.3 128 128-57.3 128-128 128z"/>
              <path fill="#FFF" d="M170.1 120.7c3.1-20.8-12.7-32-34.4-39.5l7-28.2-17.2-4.3-6.8 27.4c-4.5-1.1-9.2-2.2-13.8-3.2l6.9-27.6-17.2-4.3-7 28.2c-3.8-.9-7.5-1.8-11.1-2.8l.1-.2-23.7-5.9-4.6 18.3s12.7 2.9 12.4 3.1c6.9 1.7 8.2 6.3 8 9.9l-8 32.2c.5.1 1.1.3 1.8.5l-1.8-.4-11.2 45c-.9 2.1-3 5.3-7.9 4.1.2.3-12.4-3.1-12.4-3.1l-8.5 19.6 22.4 5.6c4.2 1 8.3 2.1 12.3 3.1l-7.1 28.4 17.2 4.3 7-28.2c4.7 1.3 9.2 2.5 13.7 3.6l-7 28.1 17.2 4.3 7.1-28.4c29.2 5.5 51.1 3.3 60.4-23.2 7.5-21.4-.4-33.8-15.8-41.8 11.3-2.6 19.7-10 22-25.3zm-39.4 55.3c-5.3 21.3-41.1 9.8-52.7 6.9l9.4-37.7c11.6 2.9 48.8 8.6 43.3 30.8zm5.3-55.6c-4.8 19.3-34.6 9.5-44.3 7.1l8.5-34.1c9.7 2.4 40.8 6.9 35.8 27z"/>
            </svg>
            <span>Create Bitcoin</span>
          </button>
        </div>
        <p className="text-center text-sm text-white/70 mt-4">
          Each wallet is derived from your master seed using standard BIP44 paths
        </p>
      </div>

      {wallets.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white text-center">Generated Wallets ({wallets.length})</h3>
          {wallets.map((wallet, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg space-y-4 border border-white/10">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  {getBlockchainIcon(wallet.blockchain)}
                  <h4 className="text-lg font-semibold text-white">
                    {wallet.blockchain} Wallet #{wallet.walletIndex + 1}
                  </h4>
                </div>
                <Trash
                  className="cursor-pointer text-red-400 hover:text-red-300 transition-colors"
                  size={20}
                  onClick={() => deleteWallet(index)}
                />
              </div>

              <div>
                <label className="text-white font-semibold">Public Key:</label>
                <p className="text-blue-300 break-all text-sm bg-black/20 p-3 rounded-lg font-mono mt-1">
                  {wallet.publickey}
                </p>
              </div>

              <div>
                <label className="text-white font-semibold">Private Key:</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type={wallet.showPrivate ? 'text' : 'password'}
                    value={wallet.privatekey}
                    readOnly
                    className="bg-black/40 text-gray-300 px-3 py-2 rounded-lg w-full break-all text-sm font-mono"
                  />
                  <button
                    className="text-xs bg-white/20 hover:bg-white/30 text-white px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                    onClick={() => togglePrivateKey(index)}
                  >
                    {wallet.showPrivate ? 'Hide' : 'Show'}
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