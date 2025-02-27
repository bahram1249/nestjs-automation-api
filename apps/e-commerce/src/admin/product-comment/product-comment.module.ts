import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '@rahino/database';
import { Permission } from '@rahino/database';
import { ECProductComment } from '@rahino/localdatabase/models';
import { ProductCommentController } from './product-comment.controller';
import { ProductCommentService } from './product-comment.service';
import { BullModule } from '@nestjs/bullmq';
import { SCORE_COMMENT_QUEUE } from './constants';
import { ConfigService } from '@nestjs/config';
import { CalculateCommentScoreService } from './services';
import { ScoreCommentProcessor } from './processor';
import { ECProductCommentFactor } from '@rahino/localdatabase/models';
import { ECProduct } from '@rahino/localdatabase/models';
import { DBLoggerModule } from '@rahino/logger';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: SCORE_COMMENT_QUEUE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_ADDRESS'),
          port: config.get<number>('REDIS_PORT'),
          password: config.get<string>('REDIS_PASSWORD'),
        },
      }),
    }),
    SequelizeModule.forFeature([
      User,
      Permission,
      ECProductComment,
      ECProductCommentFactor,
      ECProduct,
    ]),
    DBLoggerModule,
  ],
  controllers: [ProductCommentController],
  providers: [
    ProductCommentService,
    CalculateCommentScoreService,
    ScoreCommentProcessor,
  ],
})
export class AdminProductCommentModule {}
