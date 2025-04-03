import { GSRequestTypeEnum } from '@rahino/guarantee/shared/request-type';

export class NotificationSenderForSuperVisorDto {
  date: Date;
  time: string;
  requestTypeId: GSRequestTypeEnum;
}
