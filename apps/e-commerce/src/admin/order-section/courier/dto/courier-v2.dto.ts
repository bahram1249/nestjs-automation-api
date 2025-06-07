import { IntersectionType } from '@nestjs/swagger';
import { UserCourierV2Dto } from './user-courier-v2-dto';

export class CourierV2Dto extends IntersectionType(UserCourierV2Dto) {}
