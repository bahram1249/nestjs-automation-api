import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { VipGuaranteeService } from './vip-guarantee.service';
import { VipGuaranteeDto } from './dto';

@ApiTags('Client-VipGuarnatee')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/guarantee/client/vipGuarantees',
  version: ['1'],
})
export class VipGuaranteeController {
  constructor(private service: VipGuaranteeService) {}

  // public url
  @ApiOperation({ description: 'show all my guarantees' })
  @Get('/myGuarantees')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: ListFilter) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show guarantee by given id' })
  @Get('/myGuarantees/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(user, entityId);
  }

  @ApiOperation({ description: 'add guarantee card to my user' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async addGuaranteeCard(@GetUser() user: User, @Body() dto: VipGuaranteeDto) {
    return await this.service.create(user, dto);
  }

  @ApiOperation({ description: 'get guarantee avaialiablity card' })
  @Get('/availability/:serialNumber')
  @HttpCode(HttpStatus.OK)
  async getAvailability(
    @Param('serialNumber') serialNumber: string,
    @GetUser() user: User,
  ) {
    return await this.service.getAvailability(user, serialNumber);
  }
}
