import { Outlet, Link, useLocation } from "react-router-dom";
import { Wallet, Coins, Send } from "lucide-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";

function Layout() {
  const { pathname } = useLocation();

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: React.ElementType; label: string; }) => {
    const active = pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition 
        ${
          active
            ? "text-white bg-white/20 border border-white/30"
            : "text-white/70 hover:text-white hover:bg-white/10"
        }`}
      >
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-blue-900 to-slate-700">
      {/* Header */}
      <header className="w-full fixed top-0 left-0 right-0 z-50 bg-slate-900 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 py-4">
          {/* Branding */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg blur opacity-40"></div>
              <h1 className="relative text-2xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                MudraX
              </h1>
            </div>
            <Wallet className="h-6 w-6 text-purple-300" />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavItem to="/" icon={Coins} label="Home" />
            <NavItem to="/dapp" icon={Send} label="DApp" />
            <NavItem to="/wallet" icon={Wallet} label="Wallet" />
          </nav>

          {/* Wallet Controls */}
          <div className="flex items-center space-x-3">
            <WalletMultiButton
              className="
                !bg-gradient-to-r !from-blue-500 !to-purple-600 
                !text-white !font-semibold !rounded-xl !px-4 !py-2 !shadow-lg
                hover:!scale-105 hover:!shadow-purple-500/30 
                transition-transform duration-300
              "
            />
            <WalletDisconnectButton
              className="
                !bg-white/10 !text-white !px-4 !py-2 !rounded-xl !font-medium 
                !backdrop-blur-md !border !border-white/20 
                hover:!bg-white hover:!text-black transition
              "
            />
          </div>
        </div>
      </header>

            {/* Main Content */}
      <main className=" min-h-screen  pt-20 ">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 backdrop-blur-md text-white border-t border-white/10 mt-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center space-x-2">
              <Wallet className="h-5 w-5" />
              <span className="font-semibold">MudraX</span>
              <span className="text-white/60">— Your Web3 Wallet Solution</span>
            </div>
            <p className="text-white/60 text-sm text-center md:text-right">
              Built with React & Solana • Secure • Decentralized
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;