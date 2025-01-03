import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";

(async ()=> {
    const connection = new Connection(clusterApiUrl("mainnet-beta"),"confirmed");

    const tokenMint = "9ARngHhVaCtH5JFieRdSS5Y8cdZk2TMF4tfGSWFB9iSK";

    const largestAccounts = await connection.getTokenLargestAccounts(
        new PublicKey(tokenMint),
    );
    const largestAccountsInfo = await connection.getParsedAccountInfo(
        largestAccounts.value[0].address,
    );

    console.log(largestAccountsInfo?.value?.data);

    const owner = largestAccountsInfo?.value?.data?.parsed.info.owner;
    console.log("NFT owner : ", owner);

})();