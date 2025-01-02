import {
    clusterApiUrl,
    Connection,
    PublicKey,
} from "@solana/web3.js";

import { getMint } from "@solana/spl-token";

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const mintAccountPublicKey = new PublicKey(
        "8mAKLjGGmjKTnmcXeyr3pr7iX13xXVjJJiL6RujDbSPV"
    );

    let mintAccount = await getMint(connection, mintAccountPublicKey);

    console.log(mintAccount);

    
})();