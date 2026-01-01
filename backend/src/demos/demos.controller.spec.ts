import { Test, TestingModule } from '@nestjs/testing';
import { DemosController } from './demos.controller';
import { DemosService } from './demos.service';

describe('DemosController', () => {
  let controller: DemosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DemosController],
      providers: [DemosService],
    }).compile();

    controller = module.get<DemosController>(DemosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
