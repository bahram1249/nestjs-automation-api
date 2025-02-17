import { ECStock, User } from '@rahino/database';

export class validateAddressDto {
  addressId: bigint;
  user: User;
  stocks: ECStock[];
}
