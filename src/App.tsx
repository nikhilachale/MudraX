
import './App.css'
import { IconWallet } from '@tabler/icons-react';
import { ChevronUp } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { generateMnemonic,mnemonicToSeedSync } from "bip39";
import { Eye } from 'lucide-react';
import { EyeOff } from 'lucide-react';
import { useState } from 'react';
import Generatewallets from './components/Generatewallets';
function App() {
  const [mnemonic, setMnemonic] = useState("");
const [phrases, setPhrases] = useState<string[]>([]);
const [seed, setSeed] = useState("");
const [showseed, setShowseed] = useState(false);
const [showcred, setShowcred] = useState(true);



  const generatePhrases = (mn:string): void => {
    const splitPhrases = mn.split(" ");
    setPhrases(splitPhrases);
    console.log(splitPhrases);
  };

  return (
    <>

      <div className="bg-gradient-to-tr from-slate-900 via-blue-900 to-slate-700 min-h-screen  text-neutral-100">
  <div className=" w-full mx-auto flex flex-col items-center space-y-10">
    
    {/* Header */}
    <header className="w-full bg-white/10 backdrop-blur-md border flex flex-row justify-between items-center fixed top-0 border-white/20 rounded-b-2xl px-8 py-4 text-center shadow-lg z-40">
    <div className="flex items-center space-x-3">
       <h1 className="text-4xl font-extrabold">MudraX</h1>
       <IconWallet color='white' stroke={2.5} size={40} />
    </div>
    </header>

<div className='w-6xl mx-auto flex flex-col items-center mt-24 p-6 space-y-8'>

    {/* Generate Seed Button */}
    <button
      className="bg-white/10 backdrop-blur-lg border border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-black transition duration-300 shadow-lg transform hover:scale-105"
      onClick={async () => {
        const mn = await generateMnemonic();
        console.log(mn);
        setMnemonic(mn);
        generatePhrases(mn);
        const seed = mnemonicToSeedSync(mn);
        setSeed(seed.toString("hex"));
      }}
    >
      Create HD Wallet
    </button>

      {seed && (<div className='w-full max-w-4xl p-6 rounded-2xl shadow-lg bg-white/10 backdrop-blur-md'>
      <div className='flex flex-row items-center justify-between mb-4'>
        <h1 className='text-xl font-semibold'>Credentials</h1>
         {showcred ? <ChevronUp className="cursor-pointer text-white hover:text-gray-300 transition-colors" size={24} onClick={() => setShowcred(false)} />
          : <ChevronDown className="cursor-pointer text-white hover:text-gray-300 transition-colors" size={24} onClick={() => setShowcred(true)} />}



      </div>
      {showcred && (
        <div className="space-y-6">
          {/* Display Mnemonic Words */}
          {phrases.length > 0 && (
            <div className="grid p-5 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl rounded-2xl">
              {phrases.map((phrase, index) => (
                <div key={index} className="bg-black/20 text-center rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
                  <span className="text-blue-300 font-medium text-sm">{index + 1}. {phrase}</span>
                </div>
              ))}
            </div>
          )} 

          {/* Display Seed */}
          {seed && (
            <div className="">
              <div className='flex flex-row justify-between items-center mb-4'>
                <h2 className="text-xl font-semibold">Seed (Hex):</h2>
                {showseed ? <EyeOff className="cursor-pointer text-white hover:text-gray-300 transition-colors" size={24} onClick={() => setShowseed(false)} />
                  : <Eye className="cursor-pointer text-white hover:text-gray-300 transition-colors" size={24} onClick={() => setShowseed(true)} />}
              </div>
              <p className="text-sm break-all bg-black/40 text-gray-300 p-4 rounded-lg font-mono">{showseed ? seed : "•".repeat(64)}</p>
            </div>
          )}
        </div>
      )}
 
      </div>)}
   
</div>

   

    {/* Generate Wallet Component */}
    {seed &&( <Generatewallets seed={seed} />)}
   
  </div>
</div>
        
        

        

    </>
  )
}

export default App



