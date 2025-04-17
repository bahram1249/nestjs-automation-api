import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { RequestService } from './request.service';
import {
  GetRequestFilterDto,
  NormalRequestDto,
  OutOfWarrantyRequestDto,
  VipRequestDto,
} from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('GS-Client-Request')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/guarantee/client/requests',
  version: ['1'],
})
export class RequestController {
  constructor(private service: RequestService) {}

  // // public url
  @ApiOperation({ description: 'show all current user requests' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetRequestFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetRequestFilterDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'create normal guarantee request' })
  @Post('/normalRequest')
  @HttpCode(HttpStatus.CREATED)
  async createNormalGuaranteeRequest(
    @GetUser() user: User,
    @Body() dto: NormalRequestDto,
  ) {
    return await this.service.createNormalGuaranteeRequest(user, dto);
  }

  @ApiOperation({ description: 'create vip guarantee request' })
  @Post('/vipRequest')
  @HttpCode(HttpStatus.CREATED)
  async createVipGuaranteeRequest(
    @GetUser() user: User,
    @Body() dto: VipRequestDto,
  ) {
    return await this.service.createVipGuaranteeRequest(user, dto);
  }

  @ApiOperation({ description: 'create out of warranty request' })
  @Post('/outOfWarrantyRequest')
  @HttpCode(HttpStatus.CREATED)
  async createOutOfWarrantyRequest(
    @GetUser() user: User,
    @Body() dto: OutOfWarrantyRequestDto,
  ) {
    return await this.service.createOutOfWarrantyRequest(user, dto);
  }
}
