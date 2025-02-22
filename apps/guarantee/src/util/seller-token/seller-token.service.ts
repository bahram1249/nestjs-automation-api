import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { SELLER_TOKEN_STORE } from './constant';
import { GenerateTokenDto, GenerateTokenResponseDto } from './dto';
import axios from 'axios';

@Injectable()
export class SellerTokenService {
  constructor(
    private readonly config: ConfigService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  public async getToken(): Promise<string> {
    const cache = await this.cacheManager.get(SELLER_TOKEN_STORE);
    if (cache) return cache as string;
    const apiKey = this.config.get<string>('SELLER_API_KEY');
    const apiSecretKey = this.config.get<string>('SELLER_API_SECRET_KEY');
    const result = await this.generateToken({
      apiKey: apiKey,
      apiSecretKey: apiSecretKey,
    });
    await this.cacheManager.set(SELLER_TOKEN_STORE, result, 540000);
    return result;
  }

  private async generateToken(dto: GenerateTokenDto): Promise<string> {
    const response = await axios.post(
      'https://seller.ariakish.com/api/data/generateToken',
      {
        accessKey: dto.apiKey,
        secretKey: dto.apiSecretKey,
      },
    );
    const data = response.data as GenerateTokenResponseDto;
    return data.token;
  }
}
