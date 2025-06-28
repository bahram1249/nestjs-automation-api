import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { RedisRepository } from '@rahino/redis-client';
import { ProcessHomeByLatLonDto } from './dto';
import { ProcessHomeByLatLonService } from './process-home-by-lat-lon.service';

@Injectable()
export class HomePageService {
  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly processHomeByLatLonService: ProcessHomeByLatLonService,
  ) {}

  async findByLatLon(dto: ProcessHomeByLatLonDto) {
    let items: any[] = JSON.parse(
      await this.redisRepository.get(
        'home',
        `items::${dto.latitude}::${dto.longitude}`,
      ),
    );
    if (items == null) {
      items = await this.processHomeByLatLonService.processAll(dto);
      await this.redisRepository.set(
        'home',
        `items::${dto.latitude}::${dto.longitude}`,
        JSON.stringify(items),
      );
    }
    return {
      result: items,
    };
  }

  async findAll() {
    const items = JSON.parse(await this.redisRepository.get('home', 'items'));
    return {
      result: items,
    };
  }
}
