import {
    Connection,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

import {
    createMint,
    getOrCreateAssociatedTokenAccount,
    mintTo,
    createTransferInstruction,
} from "@solana/spl-token";

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    const fromWallet = Keypair.generate();
    const fromAirdropSignature = await connection.requestAirdrop(
        fromWallet.publicKey,
        LAMPORTS_PER_SOL,
    );

    await connection.confirmTransaction(fromAirdropSignature);

    const toWallet = Keypair.generate();

    const mint = await createMint(
        connection,
        fromWallet,
        fromWallet.publicKey,
        null,
        9,
    );

    const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        fromWallet.publicKey,
    );

    const toTokenAccount = await getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        mint,
        toWallet.publicKey,
    );

    await mintTo(
        connection,
        fromWallet,
        mint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        1000000000,
        [],
    );

    const transaction = new Transaction().add(
        createTransferInstruction(
            fromTokenAccount.address,
            toTokenAccount.address,
            fromWallet.publicKey,
            1,
        ),
    );

    await sendAndConfirmTransaction(connection, transaction, [fromWallet]);

})();
