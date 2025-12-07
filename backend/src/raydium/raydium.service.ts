import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PoolInfo } from './interfaces/raydium.shema';
//import { PoolFilterService } from './pool-filter.service';


const BASE = 'https://api-v3.raydium.io';

@Injectable()
export class RaydiumService {
   constructor(private readonly http: HttpService) {}

  private mapPool(pool: any): PoolInfo {
    return {
      poolId: pool.id,

      mintA_address: pool.mintA.address,
      mintB_address: pool.mintB.address,

      tvl: pool.tvl,
      feeRate: pool.feeRate,

      apr1d: pool.day?.apr ?? 0,
      apr1w: pool.week?.apr ?? 0,
      apr1m: pool.month?.apr ?? 0,

      volume1d: pool.day?.volume ?? 0,
      volume1w: pool.week?.volume ?? 0,

      volumeFee1d: pool.day?.volumeFee ?? 0,
      volumeFee1w: pool.week?.volumeFee ?? 0,
      volumeFee1m: pool.month?.volumeFee ?? 0,

      priceMin1d: pool.day?.priceMin ?? 0,
      priceMax1d: pool.day?.priceMax ?? 0,

      priceMin1w: pool.week?.priceMin ?? 0,
      priceMax1w: pool.week?.priceMax ?? 0,

      priceMin1m: pool.month?.priceMin ?? 0,
      priceMax1m: pool.month?.priceMax ?? 0,
    };
  }

  async getAllPools(): Promise<PoolInfo[]> {
    try {
    const url = `${BASE}/pools/info/list-v2?size=100`;

    const res = await firstValueFrom(this.http.get(url));
    const list = res.data?.data?.data ?? []; 

    return list.map(pool => this.mapPool(pool));

  } catch (err) {
    throw new HttpException(`Raydium getAllPools error: ${err}`, 500);
  }
  }

 async getPoolById(id: string): Promise<PoolInfo | null> {
  try {
    const url = `${BASE}/pools/info/ids?ids=${id}`;
    const res = await firstValueFrom(this.http.get(url));

    const pool = res.data?.data?.[0]; 
    if (!pool) return null;

    return this.mapPool(pool); 
  } catch (err) {
    throw new HttpException(`Raydium getPoolById error: ${err}`, 500);
  }
}

async getFilteredPools(params: {
  sortField?: string;
  sortType?: 'asc' | 'desc';
  size?: number;
}): Promise<PoolInfo[]> {
  try {
    const query = new URLSearchParams();

    if (params.sortField) query.append('sortField', params.sortField);
    if (params.sortType) query.append('sortType', params.sortType);
    if (params.size) query.append('size', String(params.size ?? 50));

    const url = `${BASE}/pools/info/list-v2?${query.toString()}`;
    console.log('📡 Raydium URL:', url);

    const res = await firstValueFrom(this.http.get(url));
    console.log('📥 Raydium Response:', JSON.stringify(res.data, null, 2));

   
    const list = res.data?.data?.data ?? [];
    return list.map(pool => this.mapPool(pool));

  } catch (err) {
    throw new HttpException(`Raydium getFilteredPools error: ${err}`, 500);
  }
}



}