import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from '@rahino/database';
import {
  BPMNOrganizationUser,
  GSGuaranteeOrganization,
} from '@rahino/localdatabase/models';
import { QueryOptionsBuilder } from '@rahino/query-filter/sequelize-query-builder';
import { GuaranteeStaticRoleEnum } from '../static-role/enum';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class OrganizationStuffService {
  constructor(
    @InjectModel(BPMNOrganizationUser)
    private readonly organizationUserRepository: typeof BPMNOrganizationUser,
    @InjectModel(GSGuaranteeOrganization)
    private readonly guaranteeOrganizationRepository: typeof GSGuaranteeOrganization,
    @InjectModel(Role)
    private readonly roleRepository: typeof Role,
    private readonly localizationService: LocalizationService,
  ) {}

  async getOrganizationByUserId(userId: bigint) {
    const role = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({
          static_id: GuaranteeStaticRoleEnum.OrganizationRole,
        })
        .build(),
    );
    if (!role) {
      throw new InternalServerErrorException(
        this.localizationService.translate('core.not_found_role'),
      );
    }

    const organizationUser = await this.organizationUserRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: userId })
        .filter({ roleId: role.id })
        .build(),
    );
    if (!organizationUser) {
      throw new BadRequestException(
        this.localizationService.translate('core.not_found_role'),
      );
    }

    return await this.guaranteeOrganizationRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ id: organizationUser.organizationId })
        .build(),
    );
  }

  async getOptionalOrganizationIdByUserId(
    userId: bigint,
  ): Promise<number | null> {
    const role = await this.roleRepository.findOne(
      new QueryOptionsBuilder()
        .filter({
          static_id: GuaranteeStaticRoleEnum.OrganizationRole,
        })
        .build(),
    );
    if (!role) {
      throw new InternalServerErrorException(
        this.localizationService.translate('core.not_found_role'),
      );
    }

    const organizationUser = await this.organizationUserRepository.findOne(
      new QueryOptionsBuilder()
        .filter({ userId: userId })
        .filter({ roleId: role.id })
        .build(),
    );
    return organizationUser != null ? organizationUser.organizationId : null;
  }
}
