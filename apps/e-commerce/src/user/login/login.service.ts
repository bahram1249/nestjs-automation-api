import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LoginDto, VerifyDto } from './dto';
import { User } from '@rahino/database/models/core/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { RedisRepository } from '@rahino/redis-client/repository';
import { AuthService } from '@rahino/core/auth/auth.service';
import * as _ from 'lodash';

@Injectable()
export class LoginService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
    private authService: AuthService,
    @InjectModel(User)
    private readonly userRepository: typeof User,
  ) {}
  async login(dto: LoginDto) {
    const randomCode = '123456';
    const findUser = await this.userRepository.findOne({
      where: {
        phoneNumber: dto.phoneNumber,
      },
    });
    await this.redisRepository.setWithExpiry(
      'usercode',
      dto.phoneNumber,
      randomCode,
      120,
    );
    return {
      result: dto.phoneNumber,
      signupStatus: findUser ? true : false,
    };
  }

  async verifyCode(dto: VerifyDto) {
    const code = await this.redisRepository.get('usercode', dto.phoneNumber);
    if (!code)
      throw new BadRequestException('the code was send it, is not true!');

    if (code != dto.code)
      throw new BadRequestException('the code was send it, is not true!');

    let user = await this.userRepository.findOne({
      where: {
        phoneNumber: dto.phoneNumber,
      },
    });
    if (!user) {
      if (dto.firstname == null || dto.lastname == null) {
        throw new BadRequestException('firstname or lastname must be send it');
      }
      user = await this.userRepository.create({
        phoneNumber: dto.phoneNumber,
        username: dto.phoneNumber,
        firstname: dto.firstname,
        lastname: dto.lastname,
      });
    }
    const signToken = await this.authService.signToken(user);

    // remove from redis
    await this.redisRepository.delete('usercode', dto.phoneNumber);

    return {
      token: signToken.access_token,
      result: _.pick(user, [
        'id',
        'firstname',
        'lastname',
        'username',
        'phoneNumber',
      ]),
    };
  }
}
