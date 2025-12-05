import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MeteoraService } from './meteora.service';
import { MeteoraController } from './meteora.controller';
import { PoolFilterService } from './pool-filter.service';


@Module({
  imports: [HttpModule],
  controllers: [MeteoraController],
  providers: [MeteoraService, PoolFilterService],
  exports: [MeteoraService],
})
export class MeteoraModule {}