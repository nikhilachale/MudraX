# 🔷 MudraX

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Solana](https://img.shields.io/badge/Solana-Web3.js-purple.svg)](https://solana.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)

MudraX is a powerful Web3 DApp built on Solana that enables users to generate secure HD wallets and interact with the blockchain using browser wallets like Phantom or self-custodied wallets derived from mnemonics. Experience seamless multi-chain wallet management with industry-standard BIP44 derivation.

**🌐 Live Demo**: [https://mudrax.vercel.app/](https://mudrax.vercel.app/)

---

## 🚀 Features

### 🔐 HD Wallet Generator
- **Generate & Import**: Create new 12-word BIP-39 mnemonic or import existing wallets
- **Multi-Chain Support**: Derive wallets for Bitcoin, Ethereum, and Solana from one seed
- **Secure Derivation**: Uses hardened path `m/44'/501'/n'/0'` for Solana compatibility
- **Comprehensive View**: Display mnemonic, seed (hex), public key, and private key
- **Privacy Controls**: Toggle sensitive information visibility with security warnings
- **Persistent Storage**: Auto-load existing wallets from secure browser storage

### 🌐 Solana DApp Integration
- **Universal Wallet Support**: Connect to browser wallets (Phantom, Solflare, Backpack, etc.)
- **Custom HD Adapter**: Seamless integration with self-custodied wallets
- **Network Flexibility**: Compatible with Devnet, Testnet, and Mainnet
- **Real-time Updates**: Live balance tracking and transaction monitoring

### ⚙️ Blockchain Operations
- 🔄 **Airdrop**: Request SOL from Devnet faucet with rate limiting
- 💰 **View Balance**: Real-time SOL balance display with transaction history
- 📤 **Send Tokens**: Transfer SOL to any address with transaction confirmation
- ✍️ **Sign Messages**: Sign arbitrary messages and verify signature validity
- 📊 **Transaction History**: View recent transactions and on-chain memo messages
- 🔍 **Address Validation**: Built-in Solana address format validation

---

## 🛠 Tech Stack

### Frontend
- **React 18+** with **TypeScript** for type-safe development
- **Vite** for lightning-fast development and optimized builds
- **Tailwind CSS** with custom glassmorphism design system
- **Lucide React** for consistent iconography

### Blockchain & Crypto
- **@solana/web3.js** - Solana blockchain interaction
- **@solana/wallet-adapter** - Universal wallet connectivity
- **bip39** - Mnemonic generation and validation
- **ed25519-hd-key** - Hierarchical deterministic key derivation
- **tweetnacl** - Cryptographic signing operations
- **bs58** - Base58 encoding for Solana addresses

### Development Tools
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing and optimization
- **TypeScript** - Static type checking

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm/yarn
- Git for version control

### Quick Start
```bash
# Clone the repository
git clone https://github.com/nikhilachale/MudraX.git
cd MudraX

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
# Navigate to http://localhost:5173
```

### Build for Production
```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview

# Deploy to Vercel (optional)
vercel --prod
```

---

## 🎯 Usage Guide

### 1. Creating a New Wallet
1. Navigate to the **Wallet** section
2. Click **"Create New Wallet"**
3. Securely store your 12-word recovery phrase
4. Access your wallet credentials and derived addresses

### 2. Importing Existing Wallet
1. Click **"Import Existing Wallet"**
2. Enter your 12-word recovery phrase
3. Wallet will be restored with all derived addresses

### 3. Using the DApp
1. Navigate to the **DApp** section
2. Connect your wallet (browser extension or imported HD wallet)
3. Perform operations: airdrop, send tokens, sign messages
4. Monitor your balance and transaction history

### 4. Multi-Chain Wallets
1. Generate or import a master seed
2. View derived wallets for Bitcoin, Ethereum, and Solana
3. Copy addresses and private keys as needed

---

## 🔒 Security Features

- **BIP39 Standard**: Industry-standard mnemonic generation
- **Secure Storage**: Encrypted seed storage in browser localStorage
- **Input Validation**: Comprehensive validation for all user inputs
- **Privacy Controls**: Hide/show sensitive information with warnings
- **No Server Dependencies**: Fully client-side cryptographic operations
- **Audit Trail**: Transaction history and signature verification

---

## 🌐 Network Configuration

### Supported Networks
- **Devnet** (Default): Testing and development
- **Testnet**: Pre-production testing
- **Mainnet**: Production Solana network

### RPC Endpoints
- Devnet: `https://api.devnet.solana.com`
- Custom RPC support available

---

## � Screenshots

### HD Wallet Generator
![Wallet Generator](./docs/wallet-generator.png)

### DApp Interface
![DApp Interface](./docs/dapp-interface.png)

### Multi-Chain Wallets
![Multi-Chain](./docs/multi-chain.png)

---

## 🚧 Development

### Project Structure
```
MudraX/
├── public/               # Static assets
├── src/
│   ├── components/       # React components
│   │   ├── Airdrop.tsx
│   │   ├── Generatewallets.tsx
│   │   ├── SendTokens.tsx
│   │   ├── ShowSolBalance.tsx
│   │   ├── SignMessage.tsx
│   │   └── MyHdWalletAdapter.ts
│   ├── pages/           # Page components
│   │   ├── Wallet.tsx
│   │   └── Dapp.tsx
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Entry point
├── package.json
└── README.md
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SOLANA_RPC_URL=https://api.devnet.solana.com
VITE_APP_NAME=MudraX
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Contribution Guidelines
- Follow TypeScript best practices
- Maintain code consistency with ESLint
- Add tests for new features
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Solana Labs** for the excellent Web3.js SDK and wallet adapter
- **Tailwind CSS** for the utility-first CSS framework
- **Vite** for the incredible development experience
- **React Team** for the powerful UI library

---

## 📞 Contact & Support

- **Developer**: [Nikhil Achale](https://github.com/nikhilachale)
- **Repository**: [MudraX](https://github.com/nikhilachale/MudraX)
- **Issues**: [Report Issues](https://github.com/nikhilachale/MudraX/issues)
- **Website**: [https://mudrax.vercel.app/](https://mudrax.vercel.app/)

---

## ⭐ Show Your Support

If you find MudraX helpful, please consider giving it a ⭐ on GitHub!

---

**Built with ❤️ for the Solana ecosystem**