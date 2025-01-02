import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Keypair,
    Transaction,sendAndConfirmTransaction,
} from "@solana/web3.js";

import {
    closeAccount,
    createCloseAccountInstruction,
} from "@solana/spl-token";

import bs58 from "bs58";

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

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

    const tokenAccountPubkey = new PublicKey(
        "2XYiFjmU1pCXmC2QfEAghk6S7UADseupkNQdnRBXszD5",
    );

    {
        let txhash = await closeAccount(
            connection,
            feePayer,
            tokenAccountPubkey,
            alice.publicKey,
            alice.publicKey,
        );
        console.log(`txhash: ${txhash}`);
    }

    {
        let tx = new Transaction().add(
            createCloseAccountInstruction(
                tokenAccountPubkey,
                alice.publicKey,
                alice.publicKey,
            ),
        );
        console.log(
            `txhash: ${await sendAndConfirmTransaction(connection, tx, [
                feePayer,
                alice,
            ])}`,
        );
    }
})();