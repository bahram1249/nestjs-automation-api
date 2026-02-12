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
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { AddressService } from './address.service';
import {
  AddressDto,
  GetAddressDto,
  GuaranteeClientAddressListResponseDto,
  GuaranteeClientAddressSingleResponseDto,
} from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('GS-Addresses')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/guarantee/client/addresses',
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
  @ApiJsonResponse({
    type: GuaranteeClientAddressListResponseDto,
    description: 'List of addresses retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetAddressDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show address by given id' })
  @Get('/:id')
  @ApiJsonResponse({
    type: GuaranteeClientAddressSingleResponseDto,
    description: 'Address retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(user, entityId);
  }

  @ApiOperation({ description: 'create address by user' })
  @Post('/')
  @ApiJsonResponse({
    type: GuaranteeClientAddressSingleResponseDto,
    status: 201,
    description: 'Address created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: AddressDto) {
    return await this.service.create(dto, user);
  }

  @ApiOperation({ description: 'update address by user' })
  @Put('/:id')
  @ApiJsonResponse({
    type: GuaranteeClientAddressSingleResponseDto,
    description: 'Address updated successfully',
  })
  @HttpCode(HttpStatus.OK)
  async update(
    @GetUser() user: User,
    @Param('id') entityId: bigint,
    @Body() dto: AddressDto,
  ) {
    return await this.service.update(user, entityId, dto);
  }

  @ApiOperation({ description: 'delete address by user' })
  @Delete('/:id')
  @ApiJsonResponse({
    type: GuaranteeClientAddressSingleResponseDto,
    description: 'Address deleted successfully',
  })
  @HttpCode(HttpStatus.OK)
  async deleteById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.deleteById(user, entityId);
  }
}
