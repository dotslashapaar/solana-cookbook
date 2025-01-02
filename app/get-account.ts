import {
    clusterApiUrl,
    Connection,
    PublicKey,
} from "@solana/web3.js";

import { getAccount } from "@solana/spl-token";

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    const tokenAccountPubkey = new PublicKey(
        "2XYiFjmU1pCXmC2QfEAghk6S7UADseupkNQdnRBXszD5",
    );

    let tokenAccount = await getAccount(connection, tokenAccountPubkey);

    console.log(tokenAccount);

})();