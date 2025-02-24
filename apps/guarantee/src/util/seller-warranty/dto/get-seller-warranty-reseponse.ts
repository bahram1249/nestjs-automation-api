import { GetSellerWarrantyDataDto } from './get-seller-warranty-data-dto';

export class GetSellerWarrantyResponse {
  data: GetSellerWarrantyDataDto[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
