import {
    Connection,
    clusterApiUrl,
} from "@solana/web3.js";

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const dataLength = 1500;

const rentExemptionAmount = await connection.getMinimumBalanceForRentExemption(dataLength);
console.log({
    rentExemptionAmount,
});
});