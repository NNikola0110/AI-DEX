use anchor_lang::prelude::*;

declare_id!("6gMZWuRFCTwH4857CPCV2h5Pr9kQuwxnn8xFLn5zohdp");

#[program]
pub mod programs {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
