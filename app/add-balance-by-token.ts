import { clusterApiUrl, Connection, Keypair, sendAndConfirmTransaction, SystemProgram, Transaction } from "@solana/web3.js";

import { ACCOUNT_SIZE, createCloseAccountInstruction, createInitializeAccountInstruction, createTransferInstruction, getAssociatedTokenAddress, getMinimumBalanceForRentExemptAccount, NATIVE_MINT, TOKEN_PROGRAM_ID } from "@solana/spl-token";

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

    let auxAccount = Keypair.generate();

    let amount = 1 * 1e9;

    let tx = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: alice.publicKey,
            newAccountPubkey: auxAccount.publicKey,
            space: ACCOUNT_SIZE,
            lamports:
            (await getMinimumBalanceForRentExemptAccount(connection)) + amount,
            programId: TOKEN_PROGRAM_ID,
        }),

        createInitializeAccountInstruction(
            auxAccount.publicKey,
            NATIVE_MINT,
            alice.publicKey,
        ),

        createTransferInstruction(
            auxAccount.publicKey,
            ata,
            alice.publicKey,
            amount,
        ),

        createCloseAccountInstruction(
            auxAccount.publicKey,
            alice.publicKey,
            alice.publicKey,
        ),
    );

    console.log(
        `txhash: ${await sendAndConfirmTransaction(connection, tx, [
            feePayer,
            auxAccount,
            alice,
        ])}`,
    );

})();