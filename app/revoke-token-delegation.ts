import {
    clusterApiUrl,
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

import {
    revoke,
    createRevokeInstruction,
} from "@solana/spl-token";

import bs58 from "bs58";

(async () => {

    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    const feePayer = Keypair.fromSecretKey(
        bs58.decode(
            "588FU4PktJWfGfxtzpAAXywSNt74AvtroVzGfKkVN1LwRuvHwKGr851uH8czM5qm4iqLbs1kKoMKtMJG4ATR7Ld2",
        ),
    );

    const tokenAccountPubkey = new PublicKey(
        "DRS5CSgPQp4uvPPcUA34tckfYFNUPNBJi77fVbnSfQHr",
    );

    const alice = Keypair.fromSecretKey(
        bs58.decode(
            "4NMwxzmYj2uvHuq8xoqhY8RXg63KSVJM1DXkpbmkUY7YQWuoyQgFnnzn6yo3CMnqZasnNPNuAT2TLwQsCaKkUddp",
        ),
    );

    {
        const txhash = await revoke(
            connection,
            feePayer,
            tokenAccountPubkey,
            alice,
        );

        console.log(`txhash: ${txhash}`);
    }

    {
        let tx = new Transaction().add(
            createRevokeInstruction(
                tokenAccountPubkey,
                alice.publicKey,
            ),

        );

        console.log(
            `txhash: ${await sendAndConfirmTransaction(connection,tx,[
                feePayer,
                alice,
            ])}`,
        );
    }

})();