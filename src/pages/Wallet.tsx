import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  Wallet as WalletIcon,
  Key,
  Shield,
  Copy,
  Check,
  Upload,
  Plus,
  LayoutDashboard,
  Activity,
} from 'lucide-react';
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from 'bip39';
import { useState, useEffect, type ReactNode } from 'react';
import Generatewallets from '../components/Generatewallets';
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
  const [active, setActive] = useState<'overview' | 'credentials' | 'accounts' | 'activity'>('overview');
  const [collapsed, setCollapsed] = useState(false);

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
    await new Promise(resolve => setTimeout(resolve, 900));
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

    if (!validateMnemonic(cleanPhrase)) {
      setImportError('Invalid seed phrase. Please enter a valid 12-word BIP39 mnemonic.');
      return;
    }

    setIsImporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 900));
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
    const seedHex = localStorage.getItem("mudrax_seed");
    if (seedHex && !walletCreated) {
      try {
        setSeed(seedHex);
        setWalletCreated(true);
        setShowCred(false);
      } catch (e) {
        console.error("Error loading existing wallet:", e);
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
        const txs = await Promise.all(
          sigs.map(sig => conn.getTransaction(sig.signature, { maxSupportedTransactionVersion: 0 }))
        );

        const memos: string[] = [];
        txs.forEach(tx => {
          if (!tx || !tx.transaction) return;

          let instructions: any[] = [];
          const transaction = tx.transaction as any;

          if (transaction.instructions && Array.isArray(transaction.instructions)) {
            instructions = transaction.instructions; // Legacy
          } else if (transaction.message && transaction.message.compiledInstructions && Array.isArray(transaction.message.compiledInstructions)) {
            instructions = transaction.message.compiledInstructions; // Versioned
          }

          instructions.forEach((ix: any) => {
            let programIdBase58 = '';
            if (ix.programId && typeof ix.programId.toBase58 === 'function') {
              programIdBase58 = ix.programId.toBase58();
            } else if (ix.programIdIndex !== undefined && transaction.message && transaction.message.staticAccountKeys) {
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

    if (walletCreated) fetchWalletData();
  }, [walletCreated]);

  useEffect(() => {
    if (!walletCreated && active !== 'overview') {
      setActive('overview');
    }
  }, [walletCreated, active]);

  const NavItem = ({
    id,
    label,
    icon,
    disabled = false,
  }: {
    id: 'overview' | 'credentials' | 'accounts' | 'activity';
    label: string;
    icon: ReactNode;
    disabled?: boolean;
  }) => {
    const isActive = active === id;
    return (
      <button
        onClick={() => {
          if (!disabled) setActive(id);
        }}
        disabled={disabled}
        className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition
          ${disabled ? 'cursor-not-allowed opacity-40' : isActive ? 'bg-white/15 border border-white/20 text-white shadow-lg' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
      >
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80">
          {icon}
        </span>
        {!collapsed && <span className="text-sm font-medium tracking-wide">{label}</span>}
        {isActive && !collapsed && (
          <span className="absolute right-4 h-1 w-6 rounded-full bg-gradient-to-r from-blue-400 to-purple-500" />
        )}
      </button>
    );
  };

  const renderSetupSection = () => (
    <section className="space-y-10">
      {!walletCreated && (
        <div className="text-center space-y-8">
          <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-3xl opacity-30 animate-pulse" />
            <WalletIcon size={100} className="text-blue-400 relative z-10" />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {showImportForm ? 'Import Your Wallet' : 'Create Your HD Wallet'}
            </h1>
            <p className="text-white/70 max-w-3xl mx-auto text-lg leading-relaxed">
              {showImportForm
                ? 'Import your existing wallet using your 12-word recovery phrase to restore access to your funds and addresses.'
                : 'Generate a secure hierarchical deterministic wallet with industry-standard BIP44 derivation. One seed phrase creates unlimited addresses for Bitcoin, Ethereum, and Solana.'}
            </p>
          </div>
        </div>
      )}

      {!walletCreated && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl hover:bg-white/15 transition">
            <div className="flex items-center space-x-2 justify-center mb-2">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">Secure</span>
            </div>
            <p className="text-white/60 text-sm">12-word recovery phrase using BIP39 standard</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl hover:bg-white/15 transition">
            <div className="flex items-center space-x-2 justify-center mb-2">
              <Key className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Multi-Chain</span>
            </div>
            <p className="text-white/60 text-sm">Bitcoin, Ethereum &amp; Solana wallets from one seed</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl hover:bg-white/15 transition">
            <div className="flex items-center space-x-2 justify-center mb-2">
              <WalletIcon className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">HD Wallets</span>
            </div>
            <p className="text-white/60 text-sm">Hierarchical deterministic address generation</p>
          </div>
        </div>
      )}

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

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={importWallet}
                disabled={isImporting || !importPhrase.trim()}
                className="flex-1 group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50"
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
        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
          <button
            className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-5 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl disabled:opacity-50"
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
                <Plus size={24} className="transition-transform duration-300 group-hover:rotate-90" />
                <span className="text-lg">Create New Wallet</span>
              </div>
            )}
          </button>

          <button
            className="group bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold py-5 px-8 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-2xl"
            onClick={() => setShowImportForm(true)}
          >
            <div className="flex items-center space-x-3">
              <Upload size={24} className="transition-transform duration-300 group-hover:translate-y-1" />
              <span className="text-lg">Import Existing Wallet</span>
            </div>
          </button>
        </div>
      )}
    </section>
  );

  const renderCredentialsSection = () => (
    <section className="bg-white/10 backdrop-blur-md p-8 rounded-3xl shadow-xl space-y-6 border border-white/20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500 rounded-full blur-md opacity-30" />
            <Shield className="text-green-400 relative z-10" size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Wallet Credentials</h2>
            <p className="text-white/60 text-sm">Your secure wallet information</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
              SECURE
            </span>
          </div>
        </div>
        <button
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300"
          onClick={() => setShowCred(!showCred)}
        >
          <span className="text-sm font-medium">{showCred ? 'Hide' : 'Show'}</span>
          {showCred ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      </div>

      {showCred && (
        <div className="space-y-8">
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

          {phrases.length > 0 ? (
            <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-blue-300">Recovery Phrase</h3>
                  <p className="text-white/60 text-sm">12-word BIP39 mnemonic seed</p>
                </div>
                <button
                  onClick={() => copyToClipboard(phrases.join(' '), 'phrase')}
                  className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 px-4 py-2 rounded-xl transition-all duration-300 border border-blue-500/30"
                >
                  {copiedPhrase ? (
                    <>
                      <Check size={18} className="text-green-400" />
                      <span className="text-sm font-medium text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      <span className="text-sm font-medium">Copy All</span>
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {phrases.map((phrase, index) => (
                  <div key={index} className="group relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative bg-black/50 border border-white/10 text-center rounded-xl p-4 hover:bg-black/60 transition-all duration-300 cursor-pointer group-hover:border-blue-500/30">
                      <div className="text-xs text-white/40 mb-1">#{index + 1}</div>
                      <div className="text-blue-300 font-semibold text-sm">{phrase}</div>
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

          <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 border border-purple-500/20 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-xl font-bold text-purple-300">Master Seed</h3>
                <p className="text-white/60 text-sm">Cryptographic seed in hexadecimal format</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => copyToClipboard(seed, 'seed')}
                  className="flex items-center space-x-2 bg-purple-500/20 hover:bg-purple-500/30 px-4 py-2 rounded-xl transition-all duration-300 border border-purple-500/30"
                >
                  {copiedSeed ? (
                    <>
                      <Check size={18} className="text-green-400" />
                      <span className="text-sm font-medium text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={18} />
                      <span className="text-sm font-medium">Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowSeed(!showSeed)}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-all duration-300"
                >
                  {showSeed ? (
                    <>
                      <EyeOff size={18} />
                      <span className="text-sm font-medium">Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye size={18} />
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
              {!showSeed && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse rounded-xl" />}
            </div>
          </div>

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
              Clear Wallet &amp; Start Over
            </button>
          </div>
        </div>
      )}
    </section>
  );

  const renderOverviewSection = () => (
    <section className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-blue-300 flex items-center gap-2">
                <WalletIcon size={24} className="text-blue-400" />
                <span>Wallet Overview</span>
              </h2>
              <p className="text-white/60 text-sm">Summary of your HD wallet performance</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/70">Devnet</span>
              <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white/70">HD Seed</span>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/15 bg-black/30 px-5 py-4 flex flex-col gap-2">
              <span className="text-white/60 text-sm">Current Balance</span>
              <span className="text-3xl font-semibold text-green-400">
                {balance !== null ? `${balance.toFixed(4)} SOL` : 'Loading...'}
              </span>
              <span className="text-white/40 text-xs">Auto-refreshes after transactions</span>
            </div>
            <div className="rounded-2xl border border-white/15 bg-black/30 px-5 py-4 flex flex-col gap-2">
              <span className="text-white/60 text-sm">Recent Messages</span>
              <span className="text-3xl font-semibold text-purple-300">{messages.length}</span>
              <span className="text-white/40 text-xs">Tracked from on-chain memo program</span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setActive('credentials')}
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:bg-white/15"
            >
              <div>
                <p className="text-sm text-white/60">Need your seed?</p>
                <p className="font-semibold text-white">View Credentials</p>
              </div>
              <ChevronRight size={18} className="text-white/50 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => {
                setShowImportForm(true);
                setActive('overview');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:bg-white/15"
            >
              <div>
                <p className="text-sm text-white/60">Switch wallets?</p>
                <p className="font-semibold text-white">Import another seed</p>
              </div>
              <ChevronRight size={18} className="text-white/50 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">Quick Actions</h3>
            <span className="text-xs uppercase tracking-[0.3em] text-white/40">HD Suite</span>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setActive('accounts')}
              className="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:bg-white/15"
            >
              <div className="flex items-center gap-3">
                <WalletIcon size={18} className="text-blue-300" />
                <div>
                  <p className="font-semibold text-white">Generate accounts</p>
                  <p className="text-xs text-white/60">Derive BTC / ETH / SOL addresses</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/50" />
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:bg-white/15"
            >
              <div className="flex items-center gap-3">
                <Key size={18} className="text-amber-300" />
                <div>
                  <p className="font-semibold text-white">Export credentials</p>
                  <p className="text-xs text-white/60">Keep your seed phrase safe offline</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/50" />
            </button>
            <button
              onClick={() => setShowImportForm(true)}
              className="w-full flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-left transition hover:bg-white/15"
            >
              <div className="flex items-center gap-3">
                <Upload size={18} className="text-teal-300" />
                <div>
                  <p className="font-semibold text-white">Replace with another wallet</p>
                  <p className="text-xs text-white/60">Import mnemonic securely</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-white/50" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-purple-300">Recent Messages</h3>
          <button
            onClick={() => setActive('activity')}
            className="text-xs font-medium text-white/60 hover:text-white transition"
          >
            View full activity
          </button>
        </div>
        {messages.length > 0 ? (
          <ul className="space-y-3">
            {messages.slice(0, 4).map((msg, i) => (
              <li key={i} className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-white/80">
                {msg}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-white/50 text-sm">No messages found on-chain</p>
        )}
      </div>
    </section>
  );

  const renderActivitySection = () => (
    <section className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity size={22} className="text-purple-300" />
          <div>
            <h3 className="text-xl font-semibold text-white">On-chain Messages</h3>
            <p className="text-white/60 text-sm">Pulled from Solana memo instructions</p>
          </div>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-white/40">Log</span>
      </div>

      {messages.length > 0 ? (
        <ul className="space-y-3">
          {messages.map((msg, index) => (
            <li
              key={`${msg}-${index}`}
              className="rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-sm text-white/80"
            >
              <span className="block text-white/50 text-xs mb-1">Memo #{messages.length - index}</span>
              {msg}
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 px-6 py-10 text-center">
          <p className="text-white/60 text-sm">No on-chain messages yet. Use the DApp console to sign and submit one.</p>
        </div>
      )}
    </section>
  );

  const renderAccountsSection = () => (
    <section className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl shadow-xl">
      <Generatewallets seed={seed} />
    </section>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-neutral-100 flex">
      <aside
        className={`sticky top-0 h-screen backdrop-blur-md bg-white/5 border-r border-white/10 transition-[width] duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        } flex flex-col`}
      >
        <div className="flex items-center justify-between px-3 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-500 shadow-lg" />
            {!collapsed && (
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">MudraX</p>
                <span className="text-sm font-semibold text-white">HD Wallet Hub</span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="rounded-xl p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="p-3 space-y-2">
          <NavItem id="overview" label="Overview" icon={<LayoutDashboard size={18} />} />
          <NavItem id="credentials" label="Credentials" icon={<Key size={18} />} disabled={!walletCreated} />
          <NavItem
            id="accounts"
            label="Accounts"
            icon={<WalletIcon size={18} />}
            disabled={!walletCreated || !seed}
          />
          <NavItem id="activity" label="Activity" icon={<Activity size={18} />} disabled={!walletCreated} />
        </nav>

        {!walletCreated && (
          <div className="mt-auto p-3">
            <div className="rounded-xl border border-blue-400/30 bg-blue-400/10 p-3 text-xs text-blue-200">
              {!collapsed ? 'Create or import a wallet to unlock full controls.' : 'ℹ️'}
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 px-4 py-8 md:px-10">
        <div className="mx-auto flex max-w-5xl flex-col gap-10">
          {(!walletCreated || showImportForm) && renderSetupSection()}
          {walletCreated && (
            <>
              {active === 'overview' && renderOverviewSection()}
              {active === 'credentials' && renderCredentialsSection()}
              {active === 'accounts' && renderAccountsSection()}
              {active === 'activity' && renderActivitySection()}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Wallet;