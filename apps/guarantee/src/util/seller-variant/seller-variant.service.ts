import { Injectable } from '@nestjs/common';
import { SellerTokenService } from '../seller-token';
import { GetSellerVariantDto, GetSellerVariantResponse } from './dto';
import axios from 'axios';

@Injectable()
export class SellerVariantService {
  constructor(private readonly sellerTokenService: SellerTokenService) {}

  public async getAll(
    dto: GetSellerVariantDto,
  ): Promise<GetSellerVariantResponse> {
    const token = await this.sellerTokenService.getToken();
    const response = await axios.get(
      'https://seller.ariakish.com/api/data/variants',
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: JSON.parse(JSON.stringify(dto)),
      },
    );
    return response.data as GetSellerVariantResponse;
  }
}
