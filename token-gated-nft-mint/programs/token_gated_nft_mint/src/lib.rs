use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;
use std::str::FromStr;

// Token address SPL (example: Wrapped SOL)
const TOKEN_X_MINT: Pubkey = Pubkey::from_str("So11111111111111111111111111111111111111112").unwrap();

declare_id!("MyProgramID");

#[program]
pub mod token_gated_nft_mint {
    use super::*;

    pub fn mint_nft(ctx: Context<MintNft>) -> Result<()> {
        let holder_account = &ctx.accounts.holder_token_account;
        require!(
            holder_account.amount > 0,
            CustomError::NotEnoughTokens
        );

        msg!("User is eligible. Proceed to mint NFT...");

        

        Ok(())
    }
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(
        constraint = holder_token_account.owner == signer.key(),
        constraint = holder_token_account.mint == TOKEN_X_MINT
    )]
    pub holder_token_account: Account<'info, TokenAccount>,
}

#[error_code]
pub enum CustomError {
    #[msg("You don't hold enough of the required token.")]
    NotEnoughTokens,
}
