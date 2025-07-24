# 🔷 MudraX

MudraX is a powerful Web3 DApp built on Solana that enables users to generate secure HD wallets and interact with the blockchain using browser wallets like Phantom or self-custodied wallets derived from mnemonics.

---

## 🚀 Features

### 🔐 HD Wallet Generator
- Generate 12-word BIP-39 mnemonic
- Derive Solana-compatible keypairs using hardened path `m/44'/501'/n'/0'`
- View mnemonic, seed (hex), public key, and private key
- Toggle sensitive information visibility

### 🌐 Solana DApp Integration
- Connect to browser wallets (Phantom, Solflare, Backpack) via `@solana/wallet-adapter`
- Compatible with Devnet (Alchemy RPC)

### ⚙️ Blockchain Operations
- 🔄 **Airdrop**: Request SOL from Devnet faucet
- 💰 **View Balance**: Show SOL balance of connected wallet
- 📤 **Send Tokens**: Transfer SOL to any address
- ✍️ **Sign Messages**: Sign arbitrary messages with your wallet and verify signature validity

---

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI**: Tailwind CSS (Glassmorphism Design)
- **Solana SDK**: `@solana/web3.js`, `@solana/wallet-adapter`
- **Wallet Derivation**: `bip39`, `ed25519-hd-key`, `tweetnacl`, `bs58`

---

## 📦 Installation

```bash
git clone https://github.com/your-username/mudrax.git
cd mudrax
npm install
npm run dev