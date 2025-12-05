import { Injectable, HttpException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PoolFilterService } from './pool-filter.service';

// Base REST docs endpoint
const BASE = 'https://dlmm-api.meteora.ag';

@Injectable()
export class MeteoraService {
  constructor(
    private readonly http: HttpService,
    private readonly filterService: PoolFilterService,
) {}

  async getAllPairs() {
    try {
      const url = `${BASE}/pair/all`;
      const res = await firstValueFrom(this.http.get(url));
      return res.data ?? [];
    } catch (err) {
      throw new HttpException(`DLMM getAllPairs error: ${err}`, 500);
    }
  }

  async getPair(address: string) {
    try {
      const url = `${BASE}/pair/${address}`;
      const res = await firstValueFrom(this.http.get(url));
      return res.data?.data ?? null;
    } catch (err) {
      throw new HttpException(`DLMM getPair error: ${err}`, 500);
    }
  }

  async getPairAnalytics(address: string) {
    try {
      const feeUrl = `${BASE}/pair/${address}/analytic/pair_fee_bps`;
      const volumeUrl = `${BASE}/pair/${address}/analytic/pair_trade_volume`;
      const tvlUrl = `${BASE}/pair/${address}/analytic/pair_tvl`;

      const [fee, volume, tvl] = await Promise.all([
        firstValueFrom(this.http.get(feeUrl)),
        firstValueFrom(this.http.get(volumeUrl)),
        firstValueFrom(this.http.get(tvlUrl)),
      ]);

      return {
        feeBps: fee.data?.data ?? [],
        volume: volume.data?.data ?? [],
        tvl: tvl.data?.data ?? [],
      };
    } catch (err) {
      throw new HttpException(`DLMM analytics error: ${err}`, 500);
    }
  }

  async getAggregatedPair(address: string) {
    const pair = await this.getPair(address);
    const analytics = await this.getPairAnalytics(address);

    return {
      address,
      tokenA: pair?.token_x_label,
      tokenB: pair?.token_y_label,
      price: pair?.current_price,
      liquidity: pair?.liquidity_in_token_x,
      volume24h: pair?.trade_volume_24h_usd,
      feeAprBps: analytics.feeBps.slice(-1)[0]?.value ?? null,
      tvlHistory: analytics.tvl.map((i) => i.value),
    };
  }

  async getAllAggregated() {
    const pairs = await this.getAllPairs();
    const results: Array<{
        address: string;
        tokenA: string;
        tokenB: string;
        price: number;
        liquidity: number;
        volume24h: number;
        feeAprBps: number;
        tvlHistory: number[];
    }> = [];

    for (const p of pairs) {
      const data = await this.getAggregatedPair(p.pair_address);
      results.push(data);
    }

    return results;
  }

  async getFilteredAggregated() {
    const all = await this.getAllAggregated();

    // Map aggregated to include metrics we filter on
    const normalized = all.map(p => ({
      ...p,
      tvlUsd: p.liquidity * p.price, // approximate TVL
      volume24hUsd: p.volume24h,
      feeApr24h: p.feeAprBps ? (p.feeAprBps / 100) : 0,
      feeApr7d: p.feeAprBps ? (p.feeAprBps / 100) : 0,
      feeApr30d: p.feeAprBps ? (p.feeAprBps / 100) : 0,
    }));

    // Filtering
    const filtered = this.filterService.filter(normalized);

    // Sorting
    return this.filterService.sortByVolTvl(filtered);
  }
}