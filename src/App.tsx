import { IconWallet } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <div className="px-4 pt-16 pb-8 text-neutral-100">
      <main className="max-w-3xl mx-auto text-center space-y-12">
        <div className="space-y-6">
          <div className="flex justify-center">
            <IconWallet color="white" stroke={1.5} size={80} className="mb-4" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white leading-relaxed">
            Launch your
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent ml-3">
              Web3 Experience
            </span>
          </h1>
          
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Secure, fast, and intuitive wallet for the decentralized web. 
            Manage your assets and interact with DApps seamlessly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <button
            onClick={() => navigate('/wallet')}
            className="bg-white/10 backdrop-blur-lg border border-white/30 text-white font-semibold py-4 px-10 rounded-xl hover:bg-white hover:text-black transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-2xl"
          >
            Launch HD Wallet
          </button>

          <button
            onClick={() => navigate('/dapp')}
            className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-4 px-10 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg transform hover:scale-105 hover:shadow-2xl"
          >
            Launch DApp
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;