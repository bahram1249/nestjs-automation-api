// import { Mapper, createMap, forMember, ignore } from '@automapper/core';
// import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
// import { Injectable } from '@nestjs/common';
// import { UserDto } from '../dto';
// import { User } from 'apps/core/src/database/sequelize/models/core/user.entity';

// @Injectable()
// export class UserProfile extends AutomapperProfile {
//   constructor(@InjectMapper() mapper: Mapper) {
//     super(mapper);
//   }

//   override get profile() {
//     return (mapper) => {
//       createMap(mapper, User, UserDto);
//       createMap(
//         mapper,
//         UserDto,
//         User,
//         forMember((dest) => dest.id, ignore()),
//       );
//       createMap(mapper, UserDto, User);
//     };
//   }
// }
