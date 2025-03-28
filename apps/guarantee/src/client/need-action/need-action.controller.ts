import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { GetUser, JwtGuard } from '@rahino/auth';
import { CartableService } from './need-action.service';
import { GetCartableDto } from './dto';
import { User } from '@rahino/database';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Need-Action')
@Controller({
  path: '/api/guarantee/client/needActions',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class CartableController {
  constructor(private service: CartableService) {}

  @ApiOperation({ description: 'show all cartable' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetCartableDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetCartableDto) {
    return await this.service.findAll(user, filter);
  }
}
