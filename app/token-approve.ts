import {
    clusterApiUrl,
    Connection,
    Keypair,
    PublicKey,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

import {
    approveChecked,
    createApproveCheckedInstruction,
} from "@solana/spl-token";

import bs58 from "bs58";

( async () => {
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

    const randomGuy = Keypair.generate();

    const mintPubkey = new PublicKey(
        "8mAKLjGGmjKTnmcXeyr3pr7iX13xXVjJJiL6RujDbSPV",
    );

    const tokenAccountPubkey = new PublicKey(
        "GMxZfDmpR1b3vdJYXHzdF5noVLQogZuUAsDHHQ3ytPfV",
    );

    {
        let txhash = await approveChecked(
            connection,
            feePayer,
            mintPubkey,
            tokenAccountPubkey,
            randomGuy.publicKey,
            alice,
            1e8,
            8,
        );
        console.log(`txhash: ${txhash}`);
    
    }

    {
        let tx = new Transaction().add(
            createApproveCheckedInstruction(
                tokenAccountPubkey,
                mintPubkey,
                randomGuy.publicKey,
                alice.publicKey,
                1e8,
                8,
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