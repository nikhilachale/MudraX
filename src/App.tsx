// App.tsx
import './App.css';
import { IconWallet } from '@tabler/icons-react';
import { ChevronUp, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { generateMnemonic, mnemonicToSeedSync } from 'bip39';
import { useState } from 'react';
import Generatewallets from './components/Generatewallets';

function App() {
  const [phrases, setPhrases] = useState<string[]>([]);
  const [seed, setSeed] = useState('');
  const [showSeed, setShowSeed] = useState(false);
  const [showCred, setShowCred] = useState(true);

  const generatePhrases = (mn: string): void => {
    const splitPhrases = mn.split(' ');
    setPhrases(splitPhrases);
    console.log(splitPhrases);
  };

  return (
    <div className="bg-gradient-to-tr from-slate-900 via-blue-900 to-slate-700 min-h-screen text-neutral-100">
      <header className="w-full bg-white/10 backdrop-blur-md border flex justify-between items-center fixed top-0 border-white/20 rounded-b-2xl px-6 py-4 shadow-lg z-40">
        <div className="flex items-center space-x-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold">MudraX</h1>
          <IconWallet color="white" stroke={2.5} size={36} />
        </div>
      </header>

      <main className="pt-24 px-4 max-w-6xl mx-auto space-y-10">
        {!seed ? (
          <section className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-8">
            <h1 className="text-3xl md:text-4xl font-black">Own Your BlockChains</h1>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-relaxed">
              Own the{' '}
              <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-500 bg-clip-text text-transparent font-extrabold">
                MudraX Wallet
              </span>
            </h1>
            <button
              className="bg-white/10 backdrop-blur-lg border border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-black transition duration-300 shadow-lg transform hover:scale-105"
              onClick={async () => {
                const mn = await generateMnemonic();
                generatePhrases(mn);
                const seed = mnemonicToSeedSync(mn);
                setSeed(seed.toString('hex'));
              }}
            >
              Create HD Wallet
            </button>
          </section>
        ) : (
          <section className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Credentials</h2>
              {showCred ? (
                <ChevronUp className="cursor-pointer" size={24} onClick={() => setShowCred(false)} />
              ) : (
                <ChevronDown className="cursor-pointer" size={24} onClick={() => setShowCred(true)} />
              )}
            </div>

            {showCred && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {phrases.map((phrase, index) => (
                    <div key={index} className="bg-black/20 text-center rounded-lg p-4 shadow hover:shadow-lg">
                      <span className="text-blue-300 font-medium text-sm">
                        {index + 1}. {phrase}
                      </span>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-xl font-semibold">Seed (Hex)</h3>
                    {showSeed ? (
                      <EyeOff className="cursor-pointer" onClick={() => setShowSeed(false)} />
                    ) : (
                      <Eye className="cursor-pointer" onClick={() => setShowSeed(true)} />
                    )}
                  </div>
                  <p className="text-sm break-all bg-black/40 text-gray-300 p-4 rounded-lg font-mono">
                    {showSeed ? seed : '•'.repeat(64)}
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                className="bg-white/10 backdrop-blur-lg border border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-black transition duration-300 shadow-lg transform hover:scale-105"
                onClick={async () => {
                  const mn = await generateMnemonic();
                  generatePhrases(mn);
                  const seed = mnemonicToSeedSync(mn);
                  setSeed(seed.toString('hex'));
                }}
              >
                Create HD Wallet
              </button>
            </div>
          </section>
        )}

        {seed && <Generatewallets seed={seed} />}
      </main>
    </div>
  );
}

export default App;
