import { Test, TestingModule } from '@nestjs/testing';
import { MeteoraService } from '../meteora.service';

describe('MeteoraService', () => {
  let service: MeteoraService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MeteoraService],
    }).compile();

    service = module.get<MeteoraService>(MeteoraService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
