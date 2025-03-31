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
import { NormalGuaranteeService } from './normal-guarantee.service';
import { NormalGuaranteeDto } from './dto';

@ApiTags('Client-NormalGuarantee')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/guarantee/client/normalGuarantee',
  version: ['1'],
})
export class NormalGuaranteeController {
  constructor(private service: NormalGuaranteeService) {}

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
  async addGuaranteeCard(
    @GetUser() user: User,
    @Body() dto: NormalGuaranteeDto,
  ) {
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
