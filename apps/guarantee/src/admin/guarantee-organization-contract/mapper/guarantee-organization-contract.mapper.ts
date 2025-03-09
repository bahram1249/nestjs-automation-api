import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { GuaranteeOrganizationContractDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { GSGuaranteeOrganizationContract } from '@rahino/localdatabase/models';

@Injectable()
export class GuaranteeOrganizationContractProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        GuaranteeOrganizationContractDto,
        GSGuaranteeOrganizationContract,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
