import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { AuthDto, UsernameDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@rahino/database';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class AuthService {
  constructor(
    //@Inject('USER_REPOSITORY')

    private jwt: JwtService,
    private config: ConfigService,
    @InjectModel(User)
    private readonly userRepository: typeof User,
  ) {}

  async signup(dto: AuthDto) {
    const findUser = await this.userRepository.findOne({
      where: {
        username: dto.username,
      },
    });
    if (findUser) {
      throw new ForbiddenException('Credentials taken');
    }

    // generate the password hash
    // const salt = bcrypt.genSaltSync(10);
    // const hashedPassword = bcrypt.hashSync(dto.password, salt);
    // save the new user in the db

    const user = await this.userRepository.create({
      username: dto.username,
      password: dto.password,
    });

    return this.signToken(user);
  }

  async signin(dto: AuthDto) {
    // find the user by email
    const user = await this.userRepository.findOne({
      where: {
        username: dto.username,
      },
    });
    // if user does not exist throw exception
    if (!user) throw new ForbiddenException('Credentials incorrect');

    // compare password
    const pwMatches = await user.validPasswordAsync(dto.password);
    //await bcrypt.compare(dto.password, user.password);
    // if password incorrect throw exception
    if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
    return this.signToken(user);
  }

  async findUser(dto: UsernameDto) {
    // find the user by username
    const user = await this.userRepository.findOne({
      where: {
        username: dto.username,
      },
    });
    // if user exist throw exception
    if (user) throw new ForbiddenException('username is taken!');
    return {
      result: 'can be reserved',
    };
  }

  public async signToken(user: User): Promise<{ access_token: string }> {
    const payload = {
      sub: user.id,
    };
    const secret = this.config.get<string>('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      secret: secret,
    });

    return {
      access_token: token,
    };
  }
}
