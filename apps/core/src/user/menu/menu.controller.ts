import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '@rahino/auth';
import { MenuService } from './menu.service';
import { MenuGetDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('CORE_USER_MENUS')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller({
  path: '/api/core/user/menus',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class MenuController {
  constructor(private service: MenuService) {}
  @ApiOperation({ description: 'show all menus of current user' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: MenuGetDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: MenuGetDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show menu of this current user by id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: number) {
    return await this.service.findById(user, entityId);
  }
}
