import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { NotificationDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { ECNotification } from '@rahino/localdatabase/models';

@Injectable()
export class NotificationProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        NotificationDto,
        ECNotification,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
