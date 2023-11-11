import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from '@rahino/database/models/core/user.entity';
import { InjectModel } from '@nestjs/sequelize';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    @InjectModel(User)
    private readonly userRepository: typeof User,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    let user: User = await this.cacheManager.get(`userid:${payload.sub}`);
    if (!user) {
      user = await this.userRepository.findOne({
        attributes: [
          'id',
          'firstname',
          'lastname',
          'email',
          'username',
          'mustChangePassword',
          'lastPasswordChangeDate',
          'static_id',
          'profilePhotoAttachmentId',
          'createdAt',
          'updatedAt',
        ],
        where: {
          id: payload.sub,
        },
      });
    }
    return user;
  }
}
