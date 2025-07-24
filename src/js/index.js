// index.js
import {
    Connection,
    LAMPORTS_PER_SOL,
    clusterApiUrl,
    PublicKey,
    Keypair,
    TOKEN_PROGRAM_ID
} from "@solana/web3.js";

import { createMint } from "@solana/spl-token";

// Setup connection
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

// Load keypair
const payer = Keypair.fromSecretKey(Uint8Array.from([
  102,144,169,42,220,87,99,85,100,128,197,17,41,234,250,84,
  87,98,161,74,15,249,83,6,120,159,135,22,46,164,204,141,
  234,217,146,214,61,187,254,97,124,111,61,29,54,110,245,
  186,11,253,11,127,213,20,73,8,25,201,22,107,4,75,26,120
]));
const mintAuthority = payer;

async function airdrop(publicKey, amount) {
    const airdropSignature = await connection.requestAirdrop(
        new PublicKey(publicKey),
        amount
    );
    await connection.confirmTransaction({ signature: airdropSignature });
    console.log("Airdrop signature:", airdropSignature);
}

async function createMintForToken(payer, mintAuthority) {
    const mint = await createMint(
        connection,
        payer,
        mintAuthority.publicKey,
        null, // no freeze authority
        6, // decimal places
        TOKEN_PROGRAM_ID
    );
    console.log("Mint created at", mint.toBase58());
    return mint;
}

async function main() {
    await airdrop(payer.publicKey, LAMPORTS_PER_SOL);
    await createMintForToken(payer, mintAuthority);
}

main();