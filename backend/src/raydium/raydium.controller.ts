import { Controller, Get, Param, Query } from '@nestjs/common';
import { RaydiumService } from './raydium.service';


@Controller('raydium')
export class RaydiumController {
constructor(private readonly raydiumService: RaydiumService) {}

  @Get('pools')
  async getAllPools(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    const all = await this.raydiumService.getAllPools();
    const start = (page - 1) * limit;
    const end = start + limit;
    return all.slice(start, end);
  }

  @Get('pools/:id')
  async getPool(@Param('id') id: string) {
    return this.raydiumService.getPoolById(id);
  }
  

  @Get('pools/filtered')
  async getFilteredPools(
    @Query('poolType') poolType?: string,
    @Query('mintFilter') mintFilter?: string,
    @Query('hasReward') hasReward?: string,
    @Query('sortField') sortField?: string,
    @Query('sortType') sortType?: 'asc' | 'desc',
    @Query('size') size?: number,
    @Query('nextPageId') nextPageId?: string,
    @Query('mint1') mint1?: string,
    @Query('mint2') mint2?: string,
  ) {
    return this.raydiumService.getFilteredPools({
      poolType,
      mintFilter,
      hasReward: hasReward === 'true',
      sortField,
      sortType,
      size,
      nextPageId,
      mint1,
      mint2,
    });
  }
}