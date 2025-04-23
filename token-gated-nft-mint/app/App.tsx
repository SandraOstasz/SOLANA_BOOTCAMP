import { useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { AnchorProvider, Program, Idl } from "@project-serum/anchor";
import idl from "./idl.json"; // wygeneruj za pomocą anchor idl fetch
import { Metaplex, walletAdapterIdentity } from "@metaplex-foundation/js";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

const PROGRAM_ID = new PublicKey("YourProgramIDHereReplaceWithReal");
const CANDY_MACHINE_ID = new PublicKey("YOUR_CANDY_MACHINE_ID");
const NETWORK = clusterApiUrl("devnet");

const connection = new Connection(NETWORK);
const wallet = new PhantomWalletAdapter();
const provider = new AnchorProvider(connection, wallet as any, {});
const program = new Program(idl as Idl, PROGRAM_ID, provider);
const metaplex = Metaplex.make(connection).use(walletAdapterIdentity(wallet));

function App() {
  const [walletConnected, setWalletConnected] = useState(false);

  const connectWallet = async () => {
    await wallet.connect();
    setWalletConnected(true);
  };

  const checkEligibility = async () => {
    const tokenAccount = await connection.getTokenAccountsByOwner(wallet.publicKey!, {
      mint: new PublicKey("So11111111111111111111111111111111111111112"), // ten sam mint SPL
    });

    if (tokenAccount.value.length === 0) {
      alert("Nie masz wymaganego tokenu.");
      return false;
    }

    try {
      const tx = await program.methods
        .mintNft()
        .accounts({
          signer: wallet.publicKey,
          holderTokenAccount: tokenAccount.value[0].pubkey,
        })
        .rpc();
      console.log("Access granted via tx:", tx);
      return true;
    } catch (e) {
      console.error("Not eligible:", e);
      alert("Nie masz dostępu.");
      return false;
    }
  };

  const mintFromCandy = async () => {
    const candyMachine = await metaplex.candyMachines().findByAddress({ address: CANDY_MACHINE_ID });
    const { nft } = await metaplex.candyMachines().mint({ candyMachine });
    alert("NFT Minted! 🎉 Tx: " + nft.address.toBase58());
  };

  const handleMint = async () => {
    const eligible = await checkEligibility();
    if (eligible) {
      await mintFromCandy();
    }

