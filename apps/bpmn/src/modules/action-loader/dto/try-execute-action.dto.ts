import { ExecuteActionDto } from '../../action/dto';

export class TryExecuteActionDto {
  source: string;
  sourceExecuteAction: ExecuteActionDto;
}
