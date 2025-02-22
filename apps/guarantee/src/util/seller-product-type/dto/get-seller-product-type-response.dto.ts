import { GetSellerProductTypeDataDto } from './get-seller-product-type-data.dto';

export class GetSellerProductTypeResponse {
  data: GetSellerProductTypeDataDto[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
