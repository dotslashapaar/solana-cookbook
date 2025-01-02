import {
    clusterApiUrl,
    Connection,
    PublicKey,
    Keypair,
    Transaction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

import {
    AuthorityType,
    createSetAuthorityInstruction,
    setAuthority,
} from "@solana/spl-token";

import bs58 from "bs58";

(async () => {
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
    console.log(`random guy: ${randomGuy.publicKey.toBase58()}`);

    const mintPubkey = new PublicKey(
        "8mAKLjGGmjKTnmcXeyr3pr7iX13xXVjJJiL6RujDbSPV",
    );

    {
        let txhash = await setAuthority(
            connection,
            feePayer,
            mintPubkey,
            alice,
            AuthorityType.MintTokens,
            randomGuy.publicKey,
        );
        console.log(`txhash: ${txhash}`);
    }

    {
        let tx = new Transaction().add(
            createSetAuthorityInstruction(
                mintPubkey,
                alice.publicKey,
                AuthorityType.MintTokens,
                feePayer.publicKey,
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