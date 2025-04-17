import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { VIP_GENERATOR_QUEUE } from '../constants';
import { InjectModel } from '@nestjs/sequelize';
import {
  GSGuarantee,
  GSVipBundleType,
  GSVipGenerator,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { BadRequestException } from '@nestjs/common';
import * as ShortUniqueId from 'short-unique-id';
import { GSProviderEnum } from '@rahino/guarantee/shared/provider';
import { GSGuaranteeTypeEnum } from '@rahino/guarantee/shared/gurantee-type';
import { GSGuaranteeConfirmStatus } from '@rahino/guarantee/shared/guarantee-confirm-status';
import * as moment from 'moment';
import { RialPriceService } from '@rahino/guarantee/shared/rial-price';
import { GSUnitPriceEnum } from '@rahino/guarantee/shared/unit-price';

@Processor(VIP_GENERATOR_QUEUE)
export class VipGeneratorProcessor extends WorkerHost {
  constructor(
    @InjectModel(GSGuarantee)
    private readonly guaranteeRepostory: typeof GSGuarantee,
    @InjectModel(GSVipGenerator)
    private readonly vipGeneratorRepository: typeof GSVipGenerator,
    @InjectModel(GSVipBundleType)
    private readonly vipBundleTypeRepository: typeof GSVipBundleType,

    private readonly rialPriceService: RialPriceService,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    try {
      const vipGeneratorId = job.data.vipGeneratorId as bigint;
      const countOfCurrentlyGenereated = await this.guaranteeRepostory.count(
        new QueryOptionsBuilder()
          .filter({ vipGeneratorId: vipGeneratorId })
          .build(),
      );

      const vipGenerator = await this.vipGeneratorRepository.findOne(
        new QueryOptionsBuilder().filter({ id: vipGeneratorId }).build(),
      );

      if (!vipGenerator) {
        throw new BadRequestException('invalid vipGeneratorId in process');
      }

      const vipBundleType = await this.vipBundleTypeRepository.findOne(
        new QueryOptionsBuilder()
          .filter({ id: vipGenerator.vipBundleTypeId })
          .build(),
      );

      const mustOfGeneratedItem = vipGenerator.qty - countOfCurrentlyGenereated;

      let generatedCount = 0;

      const uid = new ShortUniqueId({ length: 10 });
      const currentDate = new Date();
      const momentEndDate = moment(currentDate).add(
        vipBundleType.monthPeriod,
        'M',
      );
      const endDate = momentEndDate.toDate();

      while (generatedCount < mustOfGeneratedItem) {
        const randomSerialNumber = uid.rnd();
        const guarantee = await GSGuarantee.create({
          providerId: GSProviderEnum.ARIAKISH_LOCAL,
          guaranteeTypeId: GSGuaranteeTypeEnum.VIP,
          guaranteeConfirmStatusId: GSGuaranteeConfirmStatus.Confirm,
          serialNumber: randomSerialNumber,
          startDate: currentDate,
          endDate: endDate,
          vipGeneratorId: vipGeneratorId,
          vipBundleTypeId: vipBundleType.id,
          totalCredit: this.rialPriceService.getRialPrice({
            price: Number(vipGenerator.fee),
            unitPriceId: GSUnitPriceEnum.Toman,
          }),
          availableCredit: this.rialPriceService.getRialPrice({
            price: Number(vipGenerator.fee),
            unitPriceId: GSUnitPriceEnum.Toman,
          }),
        });

        generatedCount += 1;
      }

      await this.vipGeneratorRepository.update(
        { isCompleted: true },
        {
          where: {
            id: vipGenerator.id,
          },
        },
      );
    } catch (error) {
      return Promise.reject(error.message);
    }
    return Promise.resolve(true);
  }
}
