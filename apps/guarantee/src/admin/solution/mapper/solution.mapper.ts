import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { SolutionDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { GSSolution } from '@rahino/localdatabase/models';
import { ChildSolutionDto } from '../dto/child-solution.dto';

@Injectable()
export class SolutionProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        SolutionDto,
        GSSolution,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(
        mapper,
        ChildSolutionDto,
        GSSolution,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
