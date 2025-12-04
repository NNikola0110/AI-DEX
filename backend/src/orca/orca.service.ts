import { Injectable } from '@nestjs/common';
import { fetchAllWhirlpool, Whirlpool } from '@orca-so/whirlpools-client';
import { Account, createSolanaRpc, GetMultipleAccountsApi, Rpc } from '@solana/kit';
import { Address, address } from '@solana/kit';
import axios from 'axios';

@Injectable()
export class OrcaService {
    private rpc: Rpc<GetMultipleAccountsApi>;

    constructor() {
        this.rpc = createSolanaRpc('https://api.mainnet-beta.solana.com');
    }

    async fetchWhirlpools(addresses: string[]): Promise<Account<Whirlpool>[]> {
        const whirlpoolAddresses: Address[] = addresses.map((addr) => address(addr));
        const whirlpools = await fetchAllWhirlpool(this.rpc, whirlpoolAddresses);
        return whirlpools;
    }

    async getAllPools(page: number, limit: number) {
        const url = 'https://api.orca.so/v1/whirlpool/list';
        const response = await axios.get(url);

        const pools = response.data.whirlpools;

        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            page,
            limit,
            total: pools.length,
            totalPages: Math.ceil(pools.length / limit),
            data: pools.slice(start, end),
        };
    }
}
