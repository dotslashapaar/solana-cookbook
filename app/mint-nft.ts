import {createUmi} from "@metaplex-foundation/umi-bundle-defaults";

import {
    generateSigner,
    percentAmount,
    keypairIdentity,
} from "@metaplex-foundation/umi";

import { clusterApiUrl } from "@solana/web3.js";

import {
    createNft,
    fetchDigitalAsset,
    mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

(async ()=> {
    try{
        console.log("Loading keypair from evironment...");

        const privateKey = JSON.parse(process.env.SOLANA_PRIVATE_KEY || "[]");
        if(privateKey.length === 0){
            throw new Error("SOLANA_PRIVATE_KEY is not set in .env  file");
        }

        console.log("Creating Umi instance...");
        const umi = createUmi(clusterApiUrl("devnet"));
        
        const keypair = umi.eddsa.createKeypairFromSecretKey(
            new Uint8Array(privateKey),
        );

        const signer = keypairIdentity(keypair);

        umi.use(signer);
        umi.use(mplTokenMetadata());

        console.log("Keypair loaded. Public key:", keypair.publicKey);

        console.log("Generating new mint address...");
        const mint = generateSigner(umi);
     
        console.log("Creating NFT...");
        const { signature } = await createNft(umi, {
          mint,
          name: "My NFT",
          // Replace this with your Arweave metadata URI
          uri: "https://ffaaqinzhkt4ukhbohixfliubnvpjgyedi3f2iccrq4efh3s.arweave.net/KUAIIbk6p8oo4XHRcq0U__C2r0mwQaNl0gQow4Qp9yk",
          maxSupply: 1,
          sellerFeeBasisPoints: percentAmount(0),
          creators: [
            {
              address: keypair.publicKey,
              share: 100,
              verified: true,
            },
          ],
        }).sendAndConfirm(umi);
     
        console.log("NFT created successfully!");
        console.log("Mint address:", mint.publicKey);
        console.log("Transaction signature:", signature);
     
        console.log("Fetching digital asset...");
        const asset = await fetchDigitalAsset(umi, mint.publicKey);
        console.log("Digital Asset:", asset);
      } catch (error) {
        console.error("Error:", error);
        console.error("Stack trace:", error.stack);
    }
})();