import { ChevronUp, ChevronDown, Eye, EyeOff, Wallet as WalletIcon, Key, Shield, Copy, Check, Upload, Plus } from 'lucide-react';
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from 'bip39';
import { useState } from 'react';
import Generatewallets from '../components/Generatewallets';
import { useEffect } from 'react';
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';

function Wallet() {
  const [phrases, setPhrases] = useState<string[]>([]);
  const [seed, setSeed] = useState('');
  const [showSeed, setShowSeed] = useState(false);
  const [showCred, setShowCred] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [walletCreated, setWalletCreated] = useState(false);
  const [copiedPhrase, setCopiedPhrase] = useState(false);
  const [copiedSeed, setCopiedSeed] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  
  // Import wallet states
  const [showImportForm, setShowImportForm] = useState(false);
  const [importPhrase, setImportPhrase] = useState('');
  const [importError, setImportError] = useState('');
  const [isImporting, setIsImporting] = useState(false);

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
    localStorage.setItem("mudrax_seed", seedBuffer.toString('hex'));
    setIsGenerating(false);
    setWalletCreated(true);
    setShowCred(true);
  };

  const importWallet = async () => {
    setImportError('');
    
    if (!importPhrase.trim()) {
      setImportError('Please enter a seed phrase');
      return;
    }

    const cleanPhrase = importPhrase.trim().toLowerCase();
    
    // Validate mnemonic
    if (!validateMnemonic(cleanPhrase)) {
      setImportError('Invalid seed phrase. Please enter a valid 12-word BIP39 mnemonic.');
      return;
    }

    setIsImporting(true);
    
    try {
      // Simulate some processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      generatePhrases(cleanPhrase);
      const seedBuffer = mnemonicToSeedSync(cleanPhrase);
      setSeed(seedBuffer.toString('hex'));
      localStorage.setItem("mudrax_seed", seedBuffer.toString('hex'));
      
      setWalletCreated(true);
      setShowCred(true);
      setShowImportForm(false);
      setImportPhrase('');
    } catch (error) {
      setImportError('Failed to import wallet. Please try again.');
      console.error('Import error:', error);
    } finally {
      setIsImporting(false);
    }
  };

  useEffect(() => {
    // Check for existing wallet on component mount
    const seedHex = localStorage.getItem("mudrax_seed");
    if (seedHex && !walletCreated) {
      // Restore existing wallet
      try {
        setSeed(seedHex);
        // Derive original mnemonic is not possible from seed, so we'll show the wallet without phrase
        setWalletCreated(true);
        setShowCred(false); // Don't auto-show credentials for imported wallet
      } catch (e) {
        console.error("Error loading existing wallet:", e);
        // Clear corrupted seed
        localStorage.removeItem("mudrax_seed");
      }
    }
  }, [walletCreated]);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const seedHex = localStorage.getItem("mudrax_seed");
        if (!seedHex) return;
        const seedBuffer = Buffer.from(seedHex, "hex");
        const derivedSeed = seedBuffer.slice(0, 32);
        const keypair = Keypair.fromSeed(derivedSeed);
        const pubkey = keypair.publicKey;

        const conn = new Connection(clusterApiUrl("devnet"), "confirmed");

        const bal = await conn.getBalance(pubkey);
        setBalance(bal / 1e9);

        const sigs = await conn.getSignaturesForAddress(pubkey, { limit: 10 });
        const txs = await Promise.all(sigs.map(sig => conn.getTransaction(sig.signature, { maxSupportedTransactionVersion: 0 })));

        const memos: string[] = [];
        txs.forEach(tx => {
          if (!tx || !tx.transaction) return;
          
          // Handle both legacy and versioned transactions
          let instructions: any[] = [];
          const transaction = tx.transaction as any;
          
          if (transaction.instructions && Array.isArray(transaction.instructions)) {
            // Legacy transaction
            instructions = transaction.instructions;
          } else if (transaction.message && transaction.message.compiledInstructions && Array.isArray(transaction.message.compiledInstructions)) {
            // Versioned transaction - we need to get the compiled instructions
            instructions = transaction.message.compiledInstructions;
          }
          
          instructions.forEach((ix: any) => {
            // For versioned transactions, we need to resolve the program ID from accounts
            let programIdBase58 = '';
            if (ix.programId && typeof ix.programId.toBase58 === 'function') {
              // Legacy transaction
              programIdBase58 = ix.programId.toBase58();
            } else if (ix.programIdIndex !== undefined && transaction.message && transaction.message.staticAccountKeys) {
              // Versioned transaction
              const accountKeys = transaction.message.staticAccountKeys;
              if (accountKeys[ix.programIdIndex] && typeof accountKeys[ix.programIdIndex].toBase58 === 'function') {
                programIdBase58 = accountKeys[ix.programIdIndex].toBase58();
              }
            }
            
            if (programIdBase58 === "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr") {
              try {
                const msg = new TextDecoder().decode(ix.data);
                memos.push(msg);
              } catch {}
            }
          });
        });

        setMessages(memos);
      } catch (e) {
        console.error("Error fetching wallet data:", e);
      }
    };

    if (walletCreated) {
      fetchWalletData();
    }
  }, [walletCreated]);

  return (
    <div className="px-4 py-8 text-neutral-100">
      <main className="max-w-6xl mx-auto space-y-8">
        
        {/* Welcome Section */}
        {!walletCreated && (
          <div className="text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
              <WalletIcon size={100} className="text-blue-400 relative z-10 mx-auto" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                {showImportForm ? 'Import Your Wallet' : 'Create Your HD Wallet'}
              </h1>
              <p className="text-white/70 max-w-3xl mx-auto text-lg leading-relaxed">
                {showImportForm 
                  ? 'Import your existing wallet using your 12-word recovery phrase to restore access to your funds and addresses.'
                  : 'Generate a secure hierarchical deterministic wallet with industry-standard BIP44 derivation. One seed phrase creates unlimited addresses for Bitcoin, Ethereum, and Solana.'
                }
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto my-8">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                <div className="flex items-center space-x-2 justify-center mb-2">
                  <Shield className="w-5 h-5 text-green-400" />
                  <span className="text-white font-medium">Secure</span>
                </div>
                <p className="text-white/60 text-sm">12-word recovery phrase using BIP39 standard</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                <div className="flex items-center space-x-2 justify-center mb-2">
                  <Key className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-medium">Multi-Chain</span>
                </div>
                <p className="text-white/60 text-sm">Bitcoin, Ethereum & Solana wallets from one seed</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                <div className="flex items-center space-x-2 justify-center mb-2">
                  <WalletIcon className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">HD Wallets</span>
                </div>
                <p className="text-white/60 text-sm">Hierarchical deterministic address generation</p>
              </div>
            </div>
            
            {/* Import Wallet Form */}
            {showImportForm ? (
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl space-y-6">
                  <div className="flex items-center justify-center space-x-3 mb-6">
                    <Key className="text-blue-400" size={32} />
                    <h3 className="text-2xl font-bold text-blue-300">Import Existing Wallet</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-3">
                        Enter your 12-word recovery phrase
                      </label>
                      <textarea
                        value={importPhrase}
                        onChange={(e) => setImportPhrase(e.target.value)}
                        placeholder="Enter your 12-word recovery phrase separated by spaces..."
                        className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none h-24 font-mono text-sm"
                        disabled={isImporting}
                      />
                    </div>
                    
                    {importError && (
                      <div className="bg-red-500/10 border border-red-500/30 text-red-300 p-4 rounded-xl text-sm">
                        {importError}
                      </div>
                    )}
                    
                    <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-4 rounded-xl text-sm">
                      <div className="flex items-start space-x-2">
                        <Shield size={16} className="mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium mb-1">Security Notice:</p>
                          <p>Never share your recovery phrase. Make sure you're on a secure, private connection.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={importWallet}
                      disabled={isImporting || !importPhrase.trim()}
                      className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:transform-none group"
                    >
                      {isImporting ? (
                        <div className="flex items-center justify-center space-x-3">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Importing Wallet...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <Key size={20} />
                          <span>Import Wallet</span>
                        </div>
                      )}
                    </button>
                    
                    <button
                      onClick={() => {
                        setShowImportForm(false);
                        setImportPhrase('');
                        setImportError('');
                      }}
                      disabled={isImporting}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Create/Import Choice Buttons */
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
                <button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-5 px-8 rounded-2xl transition-all duration-300 shadow-xl transform hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:transform-none group"
                  onClick={createWallet}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      <span className="text-lg">Generating Secure Wallet...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                      <span className="text-lg">Create New Wallet</span>
                    </div>
                  )}
                </button>
                
                <button
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-5 px-8 rounded-2xl transition-all duration-300 shadow-xl transform hover:scale-105 hover:shadow-2xl group"
                  onClick={() => setShowImportForm(true)}
                >
                  <div className="flex items-center space-x-3">
                    <Upload size={24} className="group-hover:translate-y-1 transition-transform duration-300" />
                    <span className="text-lg">Import Existing Wallet</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Credentials Section */}
        {walletCreated && (
          <section className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl space-y-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-30"></div>
                  <Shield className="text-green-400 relative z-10" size={28} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Wallet Credentials</h2>
                  <p className="text-white/60 text-sm">Your secure wallet information</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                    SECURE
                  </span>
                </div>
              </div>
              <button
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300 group"
                onClick={() => setShowCred(!showCred)}
              >
                <span className="text-sm font-medium">{showCred ? 'Hide' : 'Show'}</span>
                {showCred ? (
                  <ChevronUp className="group-hover:text-blue-400 transition-colors" size={20} />
                ) : (
                  <ChevronDown className="group-hover:text-blue-400 transition-colors" size={20} />
                )}
              </button>
            </div>

            {showCred && (
              <div className="space-y-8">
                {/* Security Warning with Enhanced Design */}
                <div className="bg-gradient-to-r from-red-500/10 to-yellow-500/10 border border-yellow-500/40 rounded-xl p-6">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <Shield size={24} className="text-yellow-400 mt-1" />
                    </div>
                    <div>
                      <h4 className="text-yellow-300 font-semibold mb-2">🔐 Critical Security Information</h4>
                      <div className="space-y-1 text-sm text-white/80">
                        <p>• <strong>Never share</strong> your recovery phrase with anyone</p>
                        <p>• <strong>Store securely offline</strong> - write it down on paper</p>
                        <p>• <strong>This phrase controls all funds</strong> - keep it safe</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recovery Phrase with Enhanced Visual Design */}
                {phrases.length > 0 ? (
                  <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-blue-300">Recovery Phrase</h3>
                        <p className="text-white/60 text-sm">12-word BIP39 mnemonic seed</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(phrases.join(' '), 'phrase')}
                        className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 rounded-xl transition-all duration-300 group border border-blue-500/30"
                      >
                        {copiedPhrase ? (
                          <>
                            <Check size={18} className="text-green-400" />
                            <span className="text-sm font-medium text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={18} className="group-hover:text-blue-300" />
                            <span className="text-sm font-medium">Copy All</span>
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                      {phrases.map((phrase, index) => (
                        <div key={index} className="group relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative bg-black/50 border border-white/10 text-center rounded-xl p-4 hover:bg-black/60 transition-all duration-300 cursor-pointer group-hover:border-blue-500/30">
                            <div className="text-xs text-white/40 mb-1">#{index + 1}</div>
                            <div className="text-blue-300 font-semibold text-sm">
                              {phrase}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-xl p-6">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-blue-300 mb-2">Recovery Phrase</h3>
                      <p className="text-white/60 text-sm mb-4">Recovery phrase not available for this session</p>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 p-4 rounded-xl text-sm">
                        <p>This wallet was loaded from storage. The original recovery phrase is not displayed for security.</p>
                        <p className="mt-2">To view recovery phrases, create a new wallet or import using your known seed phrase.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Master Seed with Enhanced Design */}
                <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-purple-300">Master Seed</h3>
                      <p className="text-white/60 text-sm">Cryptographic seed in hexadecimal format</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => copyToClipboard(seed, 'seed')}
                        className="flex items-center space-x-2 bg-purple-500/20 hover:bg-purple-500/30 px-4 py-2 rounded-xl transition-all duration-300 group border border-purple-500/30"
                      >
                        {copiedSeed ? (
                          <>
                            <Check size={18} className="text-green-400" />
                            <span className="text-sm font-medium text-green-400">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={18} className="group-hover:text-purple-300" />
                            <span className="text-sm font-medium">Copy</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setShowSeed(!showSeed)}
                        className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300 group"
                      >
                        {showSeed ? (
                          <>
                            <EyeOff size={18} className="group-hover:text-blue-400" />
                            <span className="text-sm font-medium">Hide</span>
                          </>
                        ) : (
                          <>
                            <Eye size={18} className="group-hover:text-blue-400" />
                            <span className="text-sm font-medium">Show</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <div className="bg-black/60 border border-white/10 text-gray-300 p-6 rounded-xl font-mono text-sm break-all leading-relaxed transition-all duration-300">
                      {showSeed ? (
                        <span className="text-purple-200">{seed}</span>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-white/40">{'•'.repeat(64)}</span>
                          <span className="text-white/40 text-xs">(Click show to reveal)</span>
                        </div>
                      )}
                    </div>
                    {!showSeed && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse rounded-xl"></div>
                    )}
                  </div>
                </div>

                {/* Wallet Actions */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <button
                    className="w-full bg-white/10 backdrop-blur-lg border border-white/30 text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/20 transition-all duration-300"
                    onClick={createWallet}
                    disabled={isGenerating}
                  >
                    Generate New Wallet
                  </button>
                  
                  <button
                    className="w-full bg-red-500/20 backdrop-blur-lg border border-red-500/30 text-red-300 hover:text-red-200 font-semibold py-3 px-8 rounded-lg hover:bg-red-500/30 transition-all duration-300"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to clear the current wallet? Make sure you have your recovery phrase saved!')) {
                        localStorage.removeItem("mudrax_seed");
                        setPhrases([]);
                        setSeed('');
                        setWalletCreated(false);
                        setShowCred(false);
                        setBalance(null);
                        setMessages([]);
                      }
                    }}
                  >
                    Clear Wallet & Start Over
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {walletCreated && (
          <section className="bg-white/10 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20 space-y-6">
            <h2 className="text-2xl font-bold text-blue-300 flex items-center space-x-2">
              <WalletIcon size={24} className="text-blue-400" />
              <span>Wallet Overview</span>
            </h2>

            <div className="flex items-center justify-between bg-black/30 px-6 py-4 rounded-xl border border-white/10">
              <span className="text-white/70 text-lg">Balance:</span>
              <span className="text-green-400 text-xl font-semibold">
                {balance !== null ? `${balance.toFixed(4)} SOL` : "Loading..."}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-purple-300">Recent Messages</h3>
              {messages.length > 0 ? (
                <ul className="space-y-2">
                  {messages.map((msg, i) => (
                    <li key={i} className="bg-black/40 px-4 py-3 rounded-lg border border-white/10 text-white/80 text-sm">
                      {msg}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-white/50 text-sm">No messages found on-chain</p>
              )}
            </div>
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
