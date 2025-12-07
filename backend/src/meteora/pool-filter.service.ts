import { Injectable } from "@nestjs/common";

@Injectable()
export class PoolFilterService {
    private readonly blacklistPairs = [
    { a: 'USDT', b: 'USDC' },
    { a: 'USDC', b: 'DAI' },
    { a: 'EURC', b: 'USDC' },
  ];

    filter(pools: any[]): any[] {
        return pools.filter(pool => {

            // 0) Exclude stable pairs from blacklist
            if (this.isBlacklisted(pool.tokenA, pool.tokenB)) {
                return false;
            }
            // 1) TVL
            if (pool.tvlUsd < 1000_000) return false;

            // 2) Volume / TVL
            const volTvl = pool.volumeUsd24h / pool.tvlUsd;
            if (volTvl < 0.02) return false;

            // 3) Fee APR Consistency
            const day = pool.feeApr24h ?? 0;
            const week = pool.feeApr7d ?? 0;
            const month = pool.feeApr30d ?? 0;

            const diff1 = Math.abs(day - week) / (week || 1);
            const diff2 = Math.abs(week - month) / (month || 1);

            if (diff1 > 0.3 || diff2 > 0.3) return false;

            // 4) Pool Age
            if (pool.ageDays < 14) return false;

            // 5) Fee tier
            if (pool.feePercent < 0.25) return false;

            // 6) Stable/stable rejection
            if (pool.tokenA?.isStable && pool.tokenB?.isStable) return false;

            // 7) Token quality
            if (pool.tokenA?.marketCap < 10_000_000) return false;
            if (pool.tokenB?.marketCap < 10_000_000) return false;

            // 8) Slippage
            if (pool.priceImpact1000 > 0.01) return false;

            // 9) Anti wash-trading
            if (pool.volume24hUsd > pool.volume7dUsd * 0.5) return false;

            return true;
        });
    }

    private isBlacklisted(a: string, b: string): boolean {
        return this.blacklistPairs.some(p =>
        (p.a === a && p.b === b) ||
        (p.a === b && p.b === a) // reverse pair also excluded
        );
    }

    sortByVolTvl(pools: any[]): any[] {
        return pools.sort((a, b) => {
            const aVolTvl = a.volumeUsd24h / a.tvlUsd;
            const bVolTvl = b.volumeUsd24h / b.tvlUsd;
            return bVolTvl - aVolTvl;
        });
    }
}