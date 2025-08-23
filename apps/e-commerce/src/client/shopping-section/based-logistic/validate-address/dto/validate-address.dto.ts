import { ECAddress, ECStock } from '@rahino/localdatabase/models';

export class ValidateAddressDto {
  address: ECAddress;
  stocks: ECStock[];
}
