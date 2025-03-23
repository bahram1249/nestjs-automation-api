import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { LoginDto, VerifyDto } from './dto';
import { User } from '@rahino/database';
import { InjectModel } from '@nestjs/sequelize';
import { RedisRepository } from '@rahino/redis-client/repository';
import { AuthService } from '@rahino/core/auth/auth.service';
import * as _ from 'lodash';
import { getIntegerRandomArbitrary } from '@rahino/commontools';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { LOGIN_SMS_SENDER_QUEUE } from '@rahino/guarantee/job/login-sms-sender/constants';
import { LocalizationService } from 'apps/main/src/common/localization';

@Injectable()
export class LoginService {
  constructor(
    @Inject(RedisRepository) private readonly redisRepository: RedisRepository,
    private authService: AuthService,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @InjectQueue(LOGIN_SMS_SENDER_QUEUE)
    private readonly loginSmsSenderQueue: Queue,
    private readonly localizationService: LocalizationService,
  ) {}

  async login(dto: LoginDto) {
    const rand = getIntegerRandomArbitrary(1000, 9999).toString();
    const findUser = await this.userRepository.findOne({
      where: {
        phoneNumber: dto.phoneNumber,
      },
    });

    await this.loginSmsSenderQueue.add('login-sms-sender', {
      phoneNumber: dto.phoneNumber,
      rand,
    });

    await this.redisRepository.setWithExpiry(
      'usercode',
      dto.phoneNumber,
      rand,
      360,
    );
    return {
      result: dto.phoneNumber,
      signupStatus: findUser ? true : false,
    };
  }

  async verifyCode(dto: VerifyDto) {
    const code = await this.redisRepository.get('usercode', dto.phoneNumber);
    if (!code)
      throw new BadRequestException(
        this.localizationService.translate('core.code_was_send_it_is_not_true'),
      );

    if (code != dto.code)
      throw new BadRequestException(
        this.localizationService.translate('core.code_was_send_it_is_not_true'),
      );

    let user = await this.userRepository.findOne({
      where: {
        phoneNumber: dto.phoneNumber,
      },
    });
    if (!user) {
      if (dto.firstname == null || dto.lastname == null) {
        throw new BadRequestException(
          this.localizationService.translate(
            'core.firstname_or_lastname_must_be_send_it',
          ),
        );
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
        'birthDate',
      ]),
    };
  }
}
