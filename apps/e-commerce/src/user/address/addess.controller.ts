import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  Version,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { AddressService } from './address.service';
import { AddressDto, AddressV2Dto, GetAddressDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { OptionalSessionGuard } from '../session/guard';

@ApiTags('Addresses')
@UseGuards(JwtGuard, OptionalSessionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/user/addresses',
  version: ['1'],
})
export class AddressController {
  constructor(private service: AddressService) {}

  // public url
  @ApiOperation({ description: 'show all addresses' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetAddressDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetAddressDto) {
    return await this.service.findAll(user, filter);
  }

  @Version('2')
  @ApiOperation({ description: 'show all addresses' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetAddressDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAllV2(@GetUser() user: User, @Query() filter: GetAddressDto) {
    return await this.service.findAllV2(user, filter);
  }

  @ApiOperation({ description: 'get latest address by user id' })
  @Get('/latest')
  @HttpCode(HttpStatus.OK)
  async findLatestAddress(@GetUser() user: User) {
    return await this.service.findLatestAddress(user);
  }

  @ApiOperation({ description: 'show address by given id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(user, entityId);
  }

  @Version('2')
  @ApiOperation({ description: 'show address by given id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findByIdV2(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findByIdV2(user, entityId);
  }

  @ApiOperation({ description: 'create address by user' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: AddressDto) {
    return await this.service.create(user, dto);
  }

  @Version('2')
  @ApiOperation({ description: 'create address by user' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createV2(@GetUser() user: User, @Body() dto: AddressV2Dto) {
    return await this.service.createV2(user, dto);
  }

  @ApiOperation({ description: 'update address by user' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @GetUser() user: User,
    @Param('id') entityId: bigint,
    @Body() dto: AddressDto,
  ) {
    return await this.service.update(user, entityId, dto);
  }

  @Version('2')
  @ApiOperation({ description: 'update address by user' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateV2(
    @GetUser() user: User,
    @Param('id') entityId: bigint,
    @Body() dto: AddressV2Dto,
  ) {
    return await this.service.updateV2(user, entityId, dto);
  }

  @ApiOperation({ description: 'delete address by user' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.deleteById(user, entityId);
  }
}
