import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { REMOVE_PRODUCT_VIDEO_QUEUE } from './constants';
import { Attachment } from '@rahino/database';
import { InjectModel } from '@nestjs/sequelize';
import { MinioClientService } from '@rahino/minio-client';
import { DBLogger } from '@rahino/logger';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { Op, Sequelize } from 'sequelize';

@Processor(REMOVE_PRODUCT_VIDEO_QUEUE)
export class ProductVideoRemovalProcessor extends WorkerHost {
  private videoTempAttachmentType = 14;
  constructor(
    @InjectModel(Attachment) private repository: typeof Attachment,
    private minioService: MinioClientService,
    private logger: DBLogger,
  ) {
    super();
  }

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    const decrease = -1;
    let progress: number = 0;
    job.updateProgress(progress);
    const attachments = await this.repository.findAll(
      new QueryOptionsBuilder()
        .filter({
          attachmentTypeId: this.videoTempAttachmentType,
        })
        .filter(
          Sequelize.where(
            Sequelize.fn('isnull', Sequelize.col('isDeleted'), 0),
            {
              [Op.eq]: 0,
            },
          ),
        )
        .filter(
          Sequelize.where(Sequelize.col('createdAt'), {
            [Op.lt]: Sequelize.fn(
              'dateadd',
              Sequelize.literal('day'),
              decrease,
              Sequelize.fn('getdate'),
            ),
          }),
        )
        .build(),
    );

    const totalItem = attachments.length;
    const stepPercentage = 100 / totalItem;

    for (let index = 0; index < totalItem; index++) {
      const item = attachments[index];
      await this.minioService.remove(item.bucketName, item.fileName);
      await this.repository.update(
        { isDeleted: true },
        {
          where: {
            id: item.id,
          },
        },
      );
      progress += stepPercentage;
      job.updateProgress(progress);
    }
    return Promise.resolve(totalItem);
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    const { id, name, queueName, finishedOn, returnvalue } = job;
    const completionTime = finishedOn ? new Date(finishedOn).toISOString() : '';
    this.logger.warn(
      `Job id: ${id}, name: ${name} completed in queue ${queueName} on ${completionTime}. Result: ${returnvalue}`,
    );
  }

  @OnWorkerEvent('progress')
  onProgress(job: Job) {
    const { id, name, progress } = job;
    this.logger.log(`Job id: ${id}, name: ${name} completes ${progress}%`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job) {
    const { id, name, queueName, failedReason } = job;
    this.logger.error(
      `Job id: ${id}, name: ${name} failed in queue ${queueName}. Failed reason: ${failedReason}`,
    );
  }

  @OnWorkerEvent('active')
  onActive(job: Job) {
    const { id, name, queueName, timestamp } = job;
    const startTime = timestamp ? new Date(timestamp).toISOString() : '';
    this.logger.warn(
      `Job id: ${id}, name: ${name} starts in queue ${queueName} on ${startTime}.`,
    );
  }
}
