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
import { ApiJsonResponse } from '@rahino/response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { GetUser, JwtGuard } from '@rahino/auth';
import { GSTransactionService } from './transaction.service';
import {
  GetTransactionDto,
  GuaranteeClientTransactionResponseDto,
} from './dto';
import { User } from '@rahino/database';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-ClientTransactions')
@Controller({
  path: '/api/guarantee/client/transactions',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class TransactionController {
  constructor(private service: GSTransactionService) {}

  @ApiOperation({ description: 'show all transactions' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetTransactionDto,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({
    type: GuaranteeClientTransactionResponseDto,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetTransactionDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show transaction by given id' })
  @Get('/:id')
  @ApiJsonResponse({ type: GuaranteeClientTransactionResponseDto })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: bigint, @GetUser() user: User) {
    return await this.service.findOne(user, id);
  }
}
