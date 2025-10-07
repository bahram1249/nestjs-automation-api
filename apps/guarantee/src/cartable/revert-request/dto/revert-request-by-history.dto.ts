import { IntersectionType } from '@nestjs/swagger';
import { RevertRequestDetailDto } from './reject-request.dto';
import { IsString } from 'class-validator';

class RevertRequestToHistoryDetail {
  @IsString()
  executeBundle: string;
}

export class RevertRequestByHistoryDto extends IntersectionType(
  RevertRequestDetailDto,
  RevertRequestToHistoryDetail,
) {}
