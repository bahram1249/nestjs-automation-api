import { GSRequestTypeEnum } from '@rahino/guarantee/shared/request-type';

export class NotificationSenderForTechnicalUserDto {
  date: Date;
  time: string;
  requestTypeId: GSRequestTypeEnum;
}
