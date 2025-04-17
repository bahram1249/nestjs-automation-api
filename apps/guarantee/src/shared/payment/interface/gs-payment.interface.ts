import { GSRequestPaymentOutputDto } from '../dto/gs-request-payment-output.dto';
import { GSRequestPaymentDto } from '../dto/gs-request-payment.dto';

export interface GSPaymentInterface {
  requestPayment(dto: GSRequestPaymentDto): Promise<GSRequestPaymentOutputDto>;
}
