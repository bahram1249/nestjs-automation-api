import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '@rahino/database/models/core/user.entity';

@Injectable()
export class LoginService {
  constructor(
    @InjectModel(User)
    private readonly repository: typeof User,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
}
