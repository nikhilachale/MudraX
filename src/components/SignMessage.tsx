import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Transaction, TransactionInstruction, PublicKey } from "@solana/web3.js";

export function SignMessage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSendMessage = async () => {
    if (!publicKey) {
      setStatus("⚠️ Connect your wallet first.");
      return;
    }

    if (!message.trim()) {
      setStatus("⚠️ Please enter a message before sending.");
      return;
    }

    try {
      setStatus("⏳ Sending message to Solana network...");

      const memoProgramId = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
      const instruction = new TransactionInstruction({
        keys: [],
        programId: memoProgramId,
        data: Buffer.from(message, "utf8"),
      });

      const tx = new Transaction().add(instruction);
      const signature = await sendTransaction(tx, connection);
      await connection.confirmTransaction(signature, "confirmed");

      setStatus("✅ Message successfully sent on-chain!");
      setMessage("");
    } catch (error: any) {
      console.error("Message send error:", error);
      setStatus("❌ Failed to send message.");
    }
  };

  return (
    <div className="text-center space-y-6">
      <div className="flex items-center justify-center space-x-2 mb-6">
        <svg
          className="w-8 h-8 text-orange-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-white">Send On-Chain Message</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-blue-300 text-sm flex items-center justify-center space-x-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>Send a message recorded permanently on the Solana blockchain</span>
          </p>
        </div>

        <div>
          <label className="block text-white/70 text-sm font-medium mb-2 text-left">
            Message to Send
          </label>
          <textarea
            placeholder="Enter your message here..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-6 py-4 rounded-xl text-white bg-black/30 border border-white/20 placeholder-gray-300 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent backdrop-blur-sm resize-none"
          />
        </div>

        <button
          onClick={handleSendMessage}
          disabled={!message.trim() || !publicKey}
          className=" w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
        >
          {!publicKey ? "Connect Wallet First" : "Send Message"}
        </button>

        {status && <p className="text-sm text-white/70">{status}</p>}
      </div>
    </div>
  );
}