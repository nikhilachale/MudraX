
 
 import { Outlet, Link } from 'react-router-dom'
import { Wallet, Coins, Send } from 'lucide-react'

function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-blue-900 to-slate-700">
      {/* Header */}
      <header className="w-full bg-white/10 backdrop-blur-md border flex fixed top-0 left-0 right-0 justify-between items-center border-white/20 px-6 py-4 shadow-lg z-50">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl font-extrabold text-white">MudraX</h1>
          <Wallet className="h-6 w-6 text-white" />
        </div>
        
        {/* Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link 
            to="/" 
            className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors"
          >
            <Coins className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link 
            to="/dapp" 
            className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors"
          >
            <Send className="h-4 w-4" />
            <span>DApp</span>
          </Link>
          <Link 
            to="/wallet" 
            className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors"
          >
            <Wallet className="h-4 w-4" />
            <span>Wallet</span>
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-20 min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md text-white border-t border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Wallet className="h-5 w-5" />
              <span className="font-semibold">MudraX</span>
              <span className="text-white/60">- Your Web3 Wallet Solution</span>
            </div>
            <div className="text-white/60 text-sm">
              Built with React & Solana • Secure • Decentralized
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout
 
