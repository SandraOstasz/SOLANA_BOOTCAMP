import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TokenGatedNftMint } from "../target/types/token_gated_nft_mint";

describe("token-gated-nft-mint", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.TokenGatedNftMint as Program<TokenGatedNftMint>;

  it("Should fail if user doesn't hold the required token", async () => {
    try {
      await program.methods.mintNft().accounts({
        signer: provider.wallet.publicKey,
        holderTokenAccount: /* Provide a token account without the required token */,
      }).rpc();
      assert.fail("The transaction should have failed");
    } catch (err) {
      assert.ok(err.toString().includes("NotEnoughTokens"));
    }
  });
});

