import {
    clusterApiUrl,
    Connection,
    Keypair,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction
} from "@solana/web3.js";

import {
    NATIVE_MINT,
    getAssociatedTokenAddress,
    createSyncNativeInstruction,
} from "@solana/spl-token";

import bs58 from "bs58";

(async ()=> {
    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    const feePayer = Keypair.fromSecretKey(
        bs58.decode(
            "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2",
        ),
    );

    const alice = Keypair.fromSecretKey(
        bs58.decode(
            "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp",
        ),
    );

    let ata = await getAssociatedTokenAddress(
        NATIVE_MINT,
        alice.publicKey,
    );

    let amount = 1*1e9;

    let tx = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: alice.publicKey,
            toPubkey: ata,
            lamports: amount,
        }),

        createSyncNativeInstruction(ata),
    );

    console.log(
        `txhash: ${await sendAndConfirmTransaction(connection,tx,[
            feePayer, 
            alice
        ])}`,
    );
})();
