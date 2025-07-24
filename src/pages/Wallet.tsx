

import { ChevronUp, ChevronDown, Eye, EyeOff, Wallet as WalletIcon, Key, Shield, Copy, Check } from 'lucide-react';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { useState } from 'react';
import Generatewallets from '../components/Generatewallets';

function Wallet() {
  const [phrases, setPhrases] = useState<string[]>([]);
  const [seed, setSeed] = useState('');
  const [showSeed, setShowSeed] = useState(false);
  const [showCred, setShowCred] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [walletCreated, setWalletCreated] = useState(false);
  const [copiedPhrase, setCopiedPhrase] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);

  const generatePhrases = (mn: string): void => {
    const splitPhrases = mn.split(' ');
    setPhrases(splitPhrases);
    console.log(splitPhrases);
  };

  const copyToClipboard = async (text: string, type: 'phrase' | 'seed') => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === 'phrase') {
        setCopiedPhrase(true);
        setTimeout(() => setCopiedPhrase(false), 2000);
      } else {
        setCopiedSeed(true);
        setTimeout(() => setCopiedSeed(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const createWallet = async () => {
    setIsGenerating(true);
    
    // Simulate some processing time for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mn = await generateMnemonic();
    generatePhrases(mn);
    const seedBuffer = mnemonicToSeedSync(mn);
    setSeed(seedBuffer.toString('hex'));
    
    setIsGenerating(false);
    setWalletCreated(true);
    setShowCred(true);
  };

  return (
    <div className="px-4 py-8 text-neutral-100">
      <main className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        {!walletCreated && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <WalletIcon size={80} className="text-blue-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">Create Your HD Wallet</h1>
            <p className="text-white/70 max-w-2xl mx-auto text-lg">
              Generate a secure hierarchical deterministic wallet with a 12-word mnemonic phrase. 
              Keep your seed phrase safe - it's the only way to recover your wallet.
            </p>
            
            <div className="flex justify-center">
              <button
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-10 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:transform-none"
                onClick={createWallet}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Key size={20} />
                    <span>Create HD Wallet</span>
                  </div>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Credentials Section */}
        {walletCreated && (
          <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="text-blue-400" size={24} />
                <h2 className="text-xl font-semibold">Wallet Credentials</h2>
                <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs font-medium">
                  Generated
                </span>
              </div>
              {showCred ? (
                <ChevronUp className="cursor-pointer hover:text-blue-400 transition-colors" size={24} onClick={() => setShowCred(false)} />
              ) : (
                <ChevronDown className="cursor-pointer hover:text-blue-400 transition-colors" size={24} onClick={() => setShowCred(true)} />
              )}
            </div>

            {showCred && (
              <div className="space-y-6">
                {/* Warning */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-300 text-sm flex items-center space-x-2">
                    <Shield size={16} />
                    <span><strong>Important:</strong> Store these credentials securely. Never share them with anyone!</span>
                  </p>
                </div>

                {/* Mnemonic Phrases */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Recovery Phrase (12 words)</h3>
                    <button
                      onClick={() => copyToClipboard(phrases.join(' '), 'phrase')}
                      className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors"
                    >
                      {copiedPhrase ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                      <span className="text-sm">{copiedPhrase ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {phrases.map((phrase, index) => (
                      <div key={index} className="bg-black/30 border border-white/10 text-center rounded-lg p-3 hover:bg-black/40 transition-colors">
                        <span className="text-blue-300 font-medium text-sm">
                          {index + 1}. {phrase}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Seed */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold">Master Seed (Hex)</h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => copyToClipboard(seed, 'seed')}
                        className="flex items-center space-x-1 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-colors"
                      >
                        {copiedSeed ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        <span className="text-sm">{copiedSeed ? 'Copied!' : 'Copy'}</span>
                      </button>
                      {showSeed ? (
                        <EyeOff className="cursor-pointer hover:text-blue-400 transition-colors" onClick={() => setShowSeed(false)} />
                      ) : (
                        <Eye className="cursor-pointer hover:text-blue-400 transition-colors" onClick={() => setShowSeed(true)} />
                      )}
                    </div>
                  </div>
                  <div className="bg-black/40 border border-white/10 text-gray-300 p-4 rounded-lg font-mono text-sm break-all">
                    {showSeed ? seed : '•'.repeat(64)}
                  </div>
                </div>

                {/* Generate New Wallet Button */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/30 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300"
                    onClick={createWallet}
                    disabled={isGenerating}
                  >
                    Generate New Wallet
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Wallet Accounts Section */}
        {seed && walletCreated && (
          <Generatewallets seed={seed} />
        )}
      </main>
    </div>
  );
}

export default Wallet;
