import { IconWallet } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  return (
    <div className="px-4 pt-8 pb-12 text-neutral-100 min-h-screen flex items-center">
      <main className="max-w-6xl mx-auto w-full">
        <div className="text-center space-y-16">
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                <IconWallet color="white" stroke={1.2} size={120} className="relative z-10" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Launch your
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent block md:inline md:ml-4">
                Web3 Experience
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/70 max-w-4xl mx-auto leading-relaxed">
              Create secure HD wallets, manage multiple blockchains, and interact with decentralized applications. 
              Your gateway to the future of finance.
            </p>
          </div>

          {/* Enhanced Feature Cards */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            {[
              {
                title: "HD Wallet",
                subtitle: "Multi-Chain Wallet Generation",
                desc: "Generate secure wallets for Bitcoin, Ethereum & Solana. Create unlimited addresses from one master seed phrase using industry-standard BIP44 derivation.",
                gradient: "from-blue-500 to-purple-600",
                hoverGradient: "from-blue-600 to-purple-700",
                glowColor: "blue-500",
                tags: [
                  { name: "Bitcoin", color: "bg-orange-500/20 text-orange-300" },
                  { name: "Ethereum", color: "bg-blue-500/20 text-blue-300" },
                  { name: "Solana", color: "bg-green-500/20 text-green-300" },
                ],
                features: ["BIP44 Standard", "Secure Generation", "Multi-Chain Support"],
                path: "/wallet",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                ),
              },
              {
                title: "DApp Console",
                subtitle: "Solana Blockchain Interface",
                desc: "Connect your favorite wallets and interact with Solana blockchain. Send SOL tokens, request devnet airdrops, and sign messages securely.",
                gradient: "from-emerald-500 to-cyan-500",
                hoverGradient: "from-emerald-600 to-cyan-600",
                glowColor: "emerald-500",
                tags: [
                  { name: "Send SOL", color: "bg-orange-500/20 text-orange-300" },
                  { name: "Airdrop", color: "bg-yellow-500/20 text-yellow-300" },
                  { name: "Sign Messages", color: "bg-pink-500/20 text-pink-300" },
                ],
                features: ["Wallet Integration", "Real-time Transactions", "Devnet Testing"],
                path: "/dapp",
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                ),
              },
              {
                title: "Secure & Open",
                subtitle: "Trust Through Transparency",
                desc: "Built with industry-standard cryptographic protocols. Open-source codebase ensures transparency and community-driven security verification.",
                gradient: "from-violet-500 to-fuchsia-500",
                hoverGradient: "from-violet-600 to-fuchsia-600",
                glowColor: "violet-500",
                tags: [
                  { name: "BIP44", color: "bg-green-500/20 text-green-300" },
                  { name: "Client-side", color: "bg-blue-500/20 text-blue-300" },
                  { name: "Open Source", color: "bg-purple-500/20 text-purple-300" },
                ],
                features: ["Zero Data Collection", "Auditable Code", "Community Verified"],
                icon: (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                ),
              },
            ].map((card, i) => (
              <div
                key={i}
                onClick={() => card.path && navigate(card.path)}
                className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl group cursor-pointer transition-all duration-700 hover:border-white/30 hover:bg-white/10 transform hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
              >
                {/* Background Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-3xl`}></div>
                
                {/* Animated Border Gradient */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-3xl blur-xl opacity-30`}></div>
                </div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                  {/* Icon Container */}
                  <div className="relative">
                    <div className={`absolute inset-0 bg-gradient-to-r ${card.gradient} rounded-2xl blur-lg opacity-0 group-hover:opacity-50 transition-all duration-500 scale-110`}></div>
                    <div
                      className={`relative w-20 h-20 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}
                    >
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {card.icon}
                      </svg>
                    </div>
                  </div>

                  {/* Text Content */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text transition-all duration-500" style={{backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`}}>
                        {card.title}
                      </h3>
                      <p className="text-white/60 text-xs font-medium uppercase tracking-wider">
                        {card.subtitle}
                      </p>
                    </div>
                    
                    {/* Description with slide-up animation */}
                    <p className="text-white/70 text-sm leading-relaxed opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-150 max-w-sm mx-auto">
                      {card.desc}
                    </p>

                    {/* Feature Pills */}
                    <div className="opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-300">
                      <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                        {card.features?.map((feature, j) => (
                          <span
                            key={j}
                            className="bg-white/10 text-white/80 px-2 py-1 rounded-full text-xs font-medium border border-white/20"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Technology Tags */}
                  <div className="flex flex-wrap gap-2 justify-center opacity-90 group-hover:opacity-100 transition-opacity duration-500">
                    {card.tags.map((tag, j) => (
                      <span
                        key={j}
                        className={`${tag.color} px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border border-white/10 transition-all duration-300 hover:scale-105`}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>

                  {/* Call-to-Action */}
                  {card.path && (
                    <div className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 delay-500">
                      <div className="flex items-center space-x-2 text-white/60 text-sm font-medium">
                        <span>Click to explore</span>
                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                  <div className={`w-8 h-8 bg-gradient-to-r ${card.gradient} rounded-full blur-lg`}></div>
                </div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                  <div className={`w-6 h-6 bg-gradient-to-r ${card.gradient} rounded-full blur-lg`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Start Guide */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">🚀 Quick Start Guide</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-lg">1</div>
                  <h4 className="font-semibold text-white">Create Wallet</h4>
                  <p className="text-white/70 text-sm">Generate a secure HD wallet with 12-word recovery phrase</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-lg">2</div>
                  <h4 className="font-semibold text-white">Add Addresses</h4>
                  <p className="text-white/70 text-sm">Generate multiple addresses for Bitcoin, Ethereum, and Solana</p>
                </div>
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto text-white font-bold text-lg">3</div>
                  <h4 className="font-semibold text-white">Use DApps</h4>
                  <p className="text-white/70 text-sm">Connect to DApps and start transacting on Solana</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <button
              onClick={() => navigate('/wallet')}
              className="group relative bg-white/10 backdrop-blur-lg border border-white/30 text-white font-semibold py-5 px-12 rounded-2xl hover:bg-white hover:text-black transition-all duration-500 shadow-xl transform hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Launch HD Wallet</span>
              </span>
            </button>

            <button
              onClick={() => navigate('/dapp')}
              className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-5 px-12 rounded-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-500 shadow-xl transform hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative flex items-center space-x-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Launch DApp Console</span>
              </span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;