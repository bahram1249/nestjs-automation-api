import { RequestCurrentStateUserOutputDto } from './request-current-state-user-output.dto';

export class RequestCurrentStateOutputDto {
  activityName: string;
  users: RequestCurrentStateUserOutputDto[];
}
