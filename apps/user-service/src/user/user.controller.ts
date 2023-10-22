import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserServiceService } from './user.service';
import { UserDto } from './dto';

@Controller('users')
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}
  @Get()
  async findAll() {
    return this.userServiceService.findAll();
  }
  @Post()
  async createUser(@Body() userDto: UserDto) {
    return this.userServiceService.create(userDto);
  }
}
