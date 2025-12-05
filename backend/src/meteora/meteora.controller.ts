import { Controller, Get, Param, Query } from '@nestjs/common';
import { MeteoraService } from './meteora.service';


@Controller('meteora')
export class MeteoraController {
    constructor(private readonly meteoraService: MeteoraService) {}

    @Get('pairs')
    async getAllPairs(
        @Query('page') page = 1,
        @Query('limit') limit = 50
    ) {
        const allPairs = await this.meteoraService.getAllPairs();
        const start = (page - 1) * limit;
        const end = start + limit;
        return allPairs.slice(start, end);
    }

    @Get('pairs/:address')
    async getPair(@Param('address') address: string) {
        return this.meteoraService.getPair(address);
    }

    @Get('pairs/:address/aggregated')
    async getAggregatedPair(@Param('address') address: string) {
        return this.meteoraService.getAggregatedPair(address);
    }

    @Get('pools/aggregated')
    async getAllAggregated() {
        return this.meteoraService.getAllAggregated();
    }

    @Get('filtered')
    async getFiltered() {
        return await this.meteoraService.getFilteredAggregated();
    }
}