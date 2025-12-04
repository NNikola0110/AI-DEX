import { Controller, Get, Query } from '@nestjs/common';
import { OrcaService } from './orca.service';
import { Account } from '@solana/kit';
import { Whirlpool } from '@orca-so/whirlpools-client';
@Controller('orca')
export class OrcaController {
    constructor(private readonly orcaService: OrcaService) { }
    @Get('pools')
    async getWhirlpools(@Query('addresses') addresses: string): Promise<any> {
        if (!addresses) {
            return { error: 'Please provide valid addresses in query param' };
        }

        const addressArray = addresses.split(',').map(addr => addr.trim());

        const whirlpools: Account<Whirlpool>[] = await this.orcaService.fetchWhirlpools(addressArray);

        return whirlpools.map((w) => ({
            address: w.address,
            tokenMintA: w.data.tokenMintA.toString(),
            tokenMintB: w.data.tokenMintB.toString(),
            liquidity: w.data.liquidity.toString(),
            tickCurrentIndex: w.data.tickCurrentIndex,
            sqrtPrice: w.data.sqrtPrice.toString(),
        }));
    }
    @Get('pools/all')
    async getAllPools(@Query('page') page = 1, @Query('limit') limit = 50) {
        return this.orcaService.getAllPools(Number(page), Number(limit));
    }
}


