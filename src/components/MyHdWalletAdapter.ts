import { 
  BaseWalletAdapter, 
  WalletConnectionError,
  WalletDisconnectionError,
  WalletNotReadyError,
  WalletReadyState,
  WalletSignTransactionError
} from '@solana/wallet-adapter-base';
import type { WalletName } from '@solana/wallet-adapter-base';
import { Keypair, Transaction, PublicKey, VersionedTransaction, Connection } from '@solana/web3.js';

export class MyHdWalletAdapter extends BaseWalletAdapter {
  name: WalletName<'MudraX HD Wallet'> = 'MudraX HD Wallet' as WalletName<'MudraX HD Wallet'>;
  url = 'https://mudrax.vercel.app/';
  icon = '/wallet.png';
  readyState: WalletReadyState = WalletReadyState.Installed;
  publicKey: PublicKey | null = null;
  connecting = false;
  
  // Required properties
  supportedTransactionVersions = new Set(['legacy', 0] as const);
  
  private _keypair: Keypair;
  private _connected = false;
  
  constructor(keypair: Keypair) {
    super();
    this._keypair = keypair;
    this.publicKey = keypair.publicKey;
    this.readyState = WalletReadyState.Installed;
  }

  get connected(): boolean {
    return this._connected;
  }

  async connect(): Promise<void> {
    try {
      if (this._connected || this.connecting) return;
      
      if (this.readyState !== WalletReadyState.Installed) {
        throw new WalletNotReadyError();
      }

      this.connecting = true;
      
      // Simulate connection delay for better UX
      await new Promise(resolve => setTimeout(resolve, 100));
      
      this.publicKey = this._keypair.publicKey;
      this._connected = true;
      this.connecting = false;
      
      this.emit('connect', this.publicKey);
    } catch (error: any) {
      this.connecting = false;
      this.emit('error', error);
      throw new WalletConnectionError(error?.message, error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (!this._connected) return;
      
      this._connected = false;
      this.publicKey = null;
      
      this.emit('disconnect');
    } catch (error: any) {
      this.emit('error', error);
      throw new WalletDisconnectionError(error?.message, error);
    }
  }

 async sendTransaction(
  transaction: Transaction,
  connection: Connection,
  options: { skipPreflight?: boolean; preflightCommitment?: string } = {}
): Promise<string> {
  try {
    if (!this.publicKey) throw new Error("Wallet not connected");

    // Ensure blockhash and feePayer are set before signing
    if (!transaction.recentBlockhash) {
      const latest = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latest.blockhash;
    }
    if (!transaction.feePayer) {
      transaction.feePayer = this.publicKey;
    }

    // Sign the transaction with the HD wallet's keypair
    await this.signTransaction(transaction);

    // Send and confirm
    const rawTx = transaction.serialize();
    const sig = await connection.sendRawTransaction(rawTx, {
      skipPreflight: options.skipPreflight ?? false,
    });

    return sig;
  } catch (e) {
    console.error("WalletSendTransactionError:", e);
    throw e;
  }
}

async signTransaction<T extends Transaction>(tx: T): Promise<T> {
  if (!this._keypair) throw new Error("Wallet not initialized");
  if (!this.publicKey) throw new Error("Wallet not connected");
  if (!tx.feePayer) tx.feePayer = this.publicKey;
  if (!tx.recentBlockhash) throw new Error("Transaction recentBlockhash required");

  tx.partialSign(this._keypair);
  return tx;
}

  async signAllTransactions<T extends Transaction | VersionedTransaction>(transactions: T[]): Promise<T[]> {
    try {
      if (!this.connected || !this.publicKey) {
        throw new WalletNotReadyError('Wallet not connected');
      }

      return transactions.map(transaction => {
        if (transaction instanceof VersionedTransaction) {
          transaction.sign([this._keypair]);
        } else {
          transaction.partialSign(this._keypair);
        }
        return transaction;
      });
    } catch (error: any) {
      this.emit('error', error);
      throw new WalletSignTransactionError(error?.message, error);
    }
  }

  async signMessage(message: Uint8Array): Promise<Uint8Array> {
    try {
      if (!this.connected || !this.publicKey) {
        throw new WalletNotReadyError('Wallet not connected');
      }

      const nacl = await import('tweetnacl');
      return nacl.sign.detached(message, this._keypair.secretKey);
    } catch (error: any) {
      this.emit('error', error);
      throw new WalletSignTransactionError(error?.message, error);
    }
  }
}