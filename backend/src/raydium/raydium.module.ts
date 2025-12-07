import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {  RaydiumService } from './raydium.service';
import { RaydiumController } from './raydium.controller';


@Module({
  imports: [HttpModule],
  controllers: [RaydiumController],
  providers: [RaydiumService],
  exports: [RaydiumService],
})
export class RaydiumModule {}