import { GetSellerBrandDataDto } from './get-seller-brand-data-dto';

export class GetSellerBrandResponse {
  data: GetSellerBrandDataDto[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
