import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { RaydiumService } from './raydium.service';


@Controller('raydium')
export class RaydiumController {
constructor(private readonly raydiumService: RaydiumService) {}

  @Get('pools')
  async getAllPools(
    @Query('page') page = 1,
    @Query('limit') limit = 50,
  ) {
    console.log(` NestJS route called: /raydium/pools?page=${page}&limit=${limit}`);
    const all = await this.raydiumService.getAllPools();
    const start = (page - 1) * limit;
    const end = start + limit;
    return all.slice(start, end);
  }

@Get('pool/filtered')
    async getFilteredPools(
      @Query('sortField') sortField?: string,
      @Query('sortType') sortType?: 'asc' | 'desc',
      @Query('size', ParseIntPipe) size?: number,
    ) {
        console.log(` AANestJS route called: /raydium/pools/filtered?sortField=${sortField}&sortType=${sortType}&size=${size}`);
      return this.raydiumService.getFilteredPools({
        sortField,
        sortType,
        size,
      });
    }

  @Get('pools/:id')
  async getPool(@Param('id') id: string) {
    return this.raydiumService.getPoolById(id);
  }
  

  

    

}