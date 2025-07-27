import { IntersectionType } from '@nestjs/swagger';
import { LogisticUserDto } from '../../logistic-user-role-handler/dto';
import { CreateLogisticUserDetailDto } from './create-logistic-user-detail.dto';

export class CreateLogisticUserDto extends IntersectionType(
  LogisticUserDto,
  CreateLogisticUserDetailDto,
) {}
