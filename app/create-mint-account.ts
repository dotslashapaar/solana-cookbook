import {
    clusterApiUrl,
    Connection,
    Keypair,
    sendAndConfirmTransaction,
    SystemProgram,
    Transaction,
} from "@solana/web3.js";

import {
    createInitializeMintInstruction,
    TOKEN_PROGRAM_ID,
    MINT_SIZE,
    getMinimumBalanceForRentExemptMint,
    createMint,
} from "@solana/spl-token";

import bs58 from "bs58";

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");
    const recentBlockhash = await connection.getLatestBlockhash();

    const feePayer = Keypair.fromSecretKey(
        bs58.decode(
            "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp",
        ),
    );

    const alice = Keypair.fromSecretKey(
        bs58.decode(
            "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp",
        ),
    );

    let mintPubkey = await createMint(
        connection,
        feePayer,
        alice.publicKey,
        alice.publicKey,
        8,
    );
    console.log(`mint: ${mintPubkey.toBase58()}`);

    const mint = Keypair.generate();
    console.log(`mint: ${mint.publicKey.toBase58()}`);

    const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: feePayer.publicKey,
            newAccountPubkey: mint.publicKey,
            space: MINT_SIZE,
            lamports: await getMinimumBalanceForRentExemptMint(connection),
            programId: TOKEN_PROGRAM_ID,
        }),

        createInitializeMintInstruction(
            mint.publicKey,
            8,
            alice.publicKey,
            alice.publicKey,
        ),
    );

    const transactionSignature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [feePayer, mint],
    );

    console.log(`txhash: ${transactionSignature}`);
    
})();
