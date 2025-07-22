import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { GSProfileService } from './gsprofile.service';
import { ProfileDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@UseInterceptors(JsonResponseTransformInterceptor)
@ApiTags('GS-Profile')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller({
  path: '/api/guarantee/client/profile',
  version: ['1'],
})
export class GSProfileController {
  constructor(private service: GSProfileService) {}

  // // public url
  @ApiOperation({ description: 'get info of current user' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async get(@GetUser() user: User) {
    return await this.service.get(user);
  }

  @ApiOperation({ description: 'change info of current user' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async updateUserInfo(@GetUser() user: User, @Body() dto: ProfileDto) {
    return await this.service.updateUserInfo(user, dto);
  }
}
