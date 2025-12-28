import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { RewardRuleDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { GSRewardRule } from '@rahino/localdatabase/models';

@Injectable()
export class RewardRuleProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        RewardRuleDto,
        GSRewardRule,
        forMember((dest) => dest.id, ignore()),
        forMember((dest) => dest.createdAt, ignore()),
        forMember((dest) => dest.updatedAt, ignore()),
      );
    };
  }
}
