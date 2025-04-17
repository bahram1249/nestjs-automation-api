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
import { FactorService } from './client-factor.service';
import { GetFactorDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('GS-Client-Factor')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/guarantee/client/factors',
  version: ['1'],
})
export class FactorController {
  constructor(private service: FactorService) {}

  // public url
  @ApiOperation({ description: 'show all client factors' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetFactorDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetFactorDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show factor by given id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(user, entityId);
  }
}
