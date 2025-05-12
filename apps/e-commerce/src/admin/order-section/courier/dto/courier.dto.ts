import { IntersectionType } from '@nestjs/swagger';
import { UserCourierDto } from './user-courier-dto';

export class CourierDto extends IntersectionType(UserCourierDto) {}
