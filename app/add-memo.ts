import { transfer } from "@solana/spl-token";
import {
    Connection,
    Keypair,
    clusterApiUrl,
    SystemProgram,
    LAMPORTS_PER_SOL,
    PublicKey,
    Transaction,
    TransactionInstruction,
    sendAndConfirmTransaction,
} from "@solana/web3.js";

(async () => {
    const fromKeypair = Keypair.generate();
    const toKeypair = Keypair.generate();

    const connection = new Connection(clusterApiUrl("devnet"),"confirmed");

    const airdropSignature = await connection.requestAirdrop(
        fromKeypair.publicKey,
        LAMPORTS_PER_SOL,
    );

    await connection.confirmTransaction(airdropSignature);

    const lamportsToSend = 10;

    const transferTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: fromKeypair.publicKey,
            toPubkey: toKeypair.publicKey,
            lamports: lamportsToSend,
        }),
    );

    transferTransaction.add({
        key: [
            {pubKey: fromKeypair.publicKey, isSigner: true, isWritable: true },
        ],

        data: Buffer.from("Memo message to send in this transaction", "utf-8"),
        programId: new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
    });

    await sendAndConfirmTransaction(connection, transferTransaction, [
        fromKeypair,
    ]);

})();