import { Test, TestingModule } from '@nestjs/testing';
import { DBLogger } from './db-logger.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { WinstonLog } from '@rahino/database';
import { DatabaseModule } from '@rahino/database';

describe('LoggerService', () => {
  let service: DBLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, SequelizeModule.forFeature([WinstonLog])],
      providers: [DBLogger],
    }).compile();

    service = module.get<DBLogger>(DBLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
