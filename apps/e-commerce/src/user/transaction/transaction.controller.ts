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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '@rahino/auth';
import { JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';
import { ListFilter } from '@rahino/query-filter';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import { TransactionService } from './transaction.service';
import {
  PaymentResponseDto,
  PaymentGatewayResponseDto,
  PaymentStatusResponseDto,
  PaymentTypeResponseDto,
} from './dto';

@ApiTags('transactions')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/user/transactions',
  version: ['1'],
})
export class TransactionController {
  constructor(private readonly service: TransactionService) {}

  // public url
  @ApiOperation({ description: 'show all transactions' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({
    type: PaymentResponseDto,
    isArray: true,
    extraModels: [
      PaymentGatewayResponseDto,
      PaymentStatusResponseDto,
      PaymentTypeResponseDto,
    ],
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: ListFilter) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show transaction by given id' })
  @Get('/:id')
  @ApiJsonResponse({
    type: PaymentResponseDto,
    extraModels: [
      PaymentGatewayResponseDto,
      PaymentStatusResponseDto,
      PaymentTypeResponseDto,
    ],
  })
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(user, entityId);
  }
}
