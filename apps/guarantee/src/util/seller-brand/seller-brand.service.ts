import { Injectable } from '@nestjs/common';
import { SellerTokenService } from '../seller-token';
import { GetSellerBrandDto, GetSellerBrandResponse } from './dto';
import axios from 'axios';

@Injectable()
export class SellerBrandService {
  constructor(private readonly sellerTokenService: SellerTokenService) {}

  public async getAll(dto: GetSellerBrandDto): Promise<GetSellerBrandResponse> {
    const token = await this.sellerTokenService.getToken();
    const response = await axios.get(
      'https://seller.ariakish.com/api/data/brands',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: JSON.parse(JSON.stringify(dto)),
      },
    );
    return response.data as GetSellerBrandResponse;
  }
}
