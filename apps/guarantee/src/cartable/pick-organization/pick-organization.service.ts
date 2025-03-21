import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@rahino/database';
import { PickOrganizationDto } from './dto';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { GSRequest } from '@rahino/localdatabase/models';
import { Sequelize, Transaction } from 'sequelize';
import { GuaranteeTraverseService } from '../guarantee-traverse/guarantee-traverse.service';

@Injectable()
export class PickOrganizationService {
  constructor(
    @InjectModel(GSRequest) private readonly repository: typeof GSRequest,
    private readonly guaranteeTraverseService: GuaranteeTraverseService,
    @InjectConnection()
    private readonly sequelize: Sequelize,
  ) {}

  async traverse(user: User, dto: PickOrganizationDto) {
    await this.guaranteeTraverseService.validate(user, dto);
    try {
      const transaction = await this.sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return {
      result: null,
    };
  }
}
