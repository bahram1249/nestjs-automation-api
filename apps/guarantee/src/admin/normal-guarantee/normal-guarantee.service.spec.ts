import { Test, TestingModule } from '@nestjs/testing';
import { NormalGuaranteeService } from './normal-guarantee.service';
import { SequelizeModule } from '@nestjs/sequelize';
import {
  GSAssignedGuarantee,
  GSBrand,
  GSGuarantee,
  GSGuaranteeConfirmStatus,
  GSGuaranteePeriod,
  GSGuaranteeType,
  GSProductType,
  GSProvider,
  GSVariant,
} from '@rahino/localdatabase/models';
import { User } from '@rahino/database';
import { AutomapperModule } from 'automapper-nestjs';
import { classes } from 'automapper-classes';
import { I18nModule } from 'nestjs-i18n';

describe('NormalGuaranteeService', () => {
  let service: NormalGuaranteeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        I18nModule.forRoot({
          fallbackLanguage: 'en',
          loaderOptions: {
            path: `apps/main/src/i18n/`,
            watch: true,
          },
        }),
        SequelizeModule.forRoot({
          dialect: 'sqlite',
          storage: ':memory:',
          models: [
            GSGuarantee,
            GSProvider,
            GSBrand,
            GSGuaranteeType,
            GSGuaranteePeriod,
            GSGuaranteeConfirmStatus,
            GSVariant,
            GSProductType,
            GSAssignedGuarantee,
            User,
          ],
          autoLoadModels: true,
          logging: false,
        }),
        SequelizeModule.forFeature([
          GSGuarantee,
          GSProvider,
          GSBrand,
          GSGuaranteeType,
          GSGuaranteePeriod,
          GSGuaranteeConfirmStatus,
          GSVariant,
          GSProductType,
          GSAssignedGuarantee,
          User,
        ]),
        AutomapperModule.forRoot({
          strategyInitializer: classes(),
        }),
      ],
      providers: [NormalGuaranteeService],
    }).compile();

    service = module.get<NormalGuaranteeService>(NormalGuaranteeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
