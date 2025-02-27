import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
import { PhotoDto, PostDto } from '../dto';
import { Mapper, createMap, forMember, ignore } from 'automapper-core';
import { EAVPost } from '@rahino/localdatabase/models';
import { PostAttachmentDto } from '../dto/post-attachment.dto';

@Injectable()
export class PostProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        PostDto,
        EAVPost,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(mapper, PostAttachmentDto, PhotoDto);
    };
  }
}
