import { ed25519 } from '@noble/curves/ed25519';
import { useWallet } from '@solana/wallet-adapter-react';
import bs58 from 'bs58';
import { useState } from 'react';

export function SignMessage() {
    const { publicKey, signMessage } = useWallet();
    const [message, setMessage] = useState('');

    async function onClick() {
        if (!publicKey) {
            alert('Wallet not connected!');
            return;
        }
        if (!signMessage) {
            alert('Wallet does not support message signing!');
            return;
        }
        if (!message.trim()) {
            alert('Please enter a message to sign');
            return;
        }

        try {
            const encodedMessage = new TextEncoder().encode(message);
            const signature = await signMessage(encodedMessage);

            if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
                alert('Message signature invalid!');
                return;
            }

            alert(`✅ Message signed:\n${bs58.encode(signature)}`);
        } catch (error) {
            console.error('Signing failed:', error);
            alert('❌ Failed to sign message: ' + (error as Error).message);
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Sign a Message</h2>
            <input
                type="text"
                placeholder="Enter message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 rounded-lg text-white ring-2 ring-blue-200 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 bg-black/20 placeholder-gray-300"
            />
            <button
                onClick={onClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl w-full sm:w-64"
            >
                Sign Message
            </button>
        </div>
    );
}