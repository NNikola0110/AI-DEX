import { Test, TestingModule } from '@nestjs/testing';
import { MeteoraController } from '../meteora.controller';

describe('MeteoraController', () => {
  let controller: MeteoraController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeteoraController],
    }).compile();

    controller = module.get<MeteoraController>(MeteoraController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
