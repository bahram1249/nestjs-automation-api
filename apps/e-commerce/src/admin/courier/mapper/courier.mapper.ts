import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { UserCourierDto } from '../dto/user-courier-dto';
import { User } from '@rahino/database';

@Injectable()
export class CourierProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        UserCourierDto,
        User,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
