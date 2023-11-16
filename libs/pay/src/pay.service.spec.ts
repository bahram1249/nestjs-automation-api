import { Test, TestingModule } from '@nestjs/testing';
import { PayService } from './pay.service';

describe('PayService', () => {
  let service: PayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PayService],
    }).compile();

    service = module.get<PayService>(PayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
