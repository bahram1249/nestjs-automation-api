import { GSRequestPaymentOutputTypeEnum } from './gs-request-payment-output-type.dto';

export class GSRequestPaymentOutputDto {
  public redirectType: GSRequestPaymentOutputTypeEnum;
  public data?: any;
  public redirectUrl: string;
}
