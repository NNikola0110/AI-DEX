import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrcaModule } from './orca/orca.module';
import { MeteoraModule } from './meteora/meteora.module';

@Module({
  imports: [OrcaModule, MeteoraModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
