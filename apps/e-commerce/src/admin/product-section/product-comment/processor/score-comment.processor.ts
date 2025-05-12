import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { SCORE_COMMENT_QUEUE } from '../constants';
import { DBLogger } from '@rahino/logger';
import { CalculateCommentScoreService } from '../services';

@Processor(SCORE_COMMENT_QUEUE)
export class ScoreCommentProcessor extends WorkerHost {
  constructor(
    private readonly logger: DBLogger,
    private readonly calculateCommentScoreService: CalculateCommentScoreService,
  ) {
    super();
  }

  async process(job: Job<any, any, any>, token?: string): Promise<any> {
    if (!job.data.commentId) {
      return Promise.reject('commentId not provided!');
    }

    const commentId = job.data.commentId;
    try {
      await this.calculateCommentScoreService.calculateCommentScore(commentId);
    } catch (error) {
      Promise.reject(error.message);
    }
    return Promise.resolve(commentId);
  }
}
