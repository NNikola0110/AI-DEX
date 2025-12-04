import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrcaModule } from './orca/orca.module';

@Module({
  imports: [OrcaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
