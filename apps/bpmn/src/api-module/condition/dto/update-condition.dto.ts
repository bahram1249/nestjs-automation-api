import { PartialType } from '@nestjs/swagger';
import { CreateConditionDto } from './create-condition.dto';

export class UpdateConditionDto extends PartialType(CreateConditionDto) {}
