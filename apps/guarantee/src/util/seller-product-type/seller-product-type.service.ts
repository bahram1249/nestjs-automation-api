import { Injectable } from '@nestjs/common';
import { SellerTokenService } from '../seller-token';
import { GetSellerProductTypeDto, GetSellerProductTypeResponse } from './dto';
import axios from 'axios';

@Injectable()
export class SellerProductTypeService {
  constructor(private readonly sellerTokenService: SellerTokenService) {}

  public async getAll(
    dto: GetSellerProductTypeDto,
  ): Promise<GetSellerProductTypeResponse> {
    const token = await this.sellerTokenService.getToken();
    const response = await axios.get(
      'https://seller.ariakish.com/api/data/products',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: JSON.parse(JSON.stringify(dto)),
      },
    );
    return response.data as GetSellerProductTypeResponse;
  }
}
