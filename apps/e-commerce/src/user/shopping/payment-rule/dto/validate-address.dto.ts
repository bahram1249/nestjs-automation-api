import { ECStock } from '@rahino/localdatabase/models';
import { User } from '@rahino/database';

export class validateAddressDto {
  addressId: bigint;
  user: User;
  stocks: ECStock[];
}
