import { Injectable } from '@nestjs/common';
import { SellerTokenService } from '../seller-token';
import { GetSellerWarrantyDto, GetSellerWarrantyResponse } from './dto';
import axios from 'axios';

@Injectable()
export class SellerWarrantyService {
  constructor(private readonly sellerTokenService: SellerTokenService) {}

  public async getAll(
    dto: GetSellerWarrantyDto,
  ): Promise<GetSellerWarrantyResponse> {
    const token = await this.sellerTokenService.getToken();
    const response = await axios.get(
      'https://seller.ariakish.com/api/data/warranties',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: JSON.parse(JSON.stringify(dto)),
      },
    );
    return response.data as GetSellerWarrantyResponse;
  }
}
