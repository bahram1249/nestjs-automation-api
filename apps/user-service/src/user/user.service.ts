import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Users } from './model/user.model';
import { UserDto } from './dto';

@Injectable()
export class UserServiceService {
  constructor(
    @InjectModel(Users)
    private readonly userModel: typeof Users,
  ) {}
  async findAll(): Promise<Users[]> {
    return this.userModel.findAll();
  }

  async create(userDto: UserDto): Promise<Users> {
    return this.userModel.create(<Users>userDto);
  }
}
