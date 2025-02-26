import { GetSellerVariantDataDto } from './get-seller-variant-data.dto';

export class GetSellerVariantResponse {
  data: GetSellerVariantDataDto[];
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}
