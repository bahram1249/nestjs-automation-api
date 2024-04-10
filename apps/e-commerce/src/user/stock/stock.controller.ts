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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { OptionalJwtGuard } from '@rahino/auth/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { SessionGuard } from '../session/guard';
import { GetECSession } from 'apps/main/src/decorator';
import { ECUserSession } from '@rahino/database/models/ecommerce-eav/ec-user-session.entity';
import { StockDto, StockPriceDto } from './dto';
import { StockService } from './stock.service';
import { GetUser } from '@rahino/auth/decorator';
import { User } from '@rahino/database/models/core/user.entity';

@ApiTags('Stocks')
@UseGuards(OptionalJwtGuard, SessionGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/user/stocks',
  version: ['1'],
})
export class StockController {
  constructor(private readonly service: StockService) {}
  @ApiOperation({ description: 'show all stocks' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@GetECSession() session: ECUserSession) {
    return await this.service.findAll(session);
  }

  @ApiOperation({ description: 'count all stock' })
  @Get('/count')
  @HttpCode(HttpStatus.OK)
  async count(@GetECSession() session: ECUserSession) {
    return await this.service.count(session);
  }

  @ApiOperation({ description: 'total price' })
  @Post('/price')
  @HttpCode(HttpStatus.OK)
  async price(
    @GetECSession() session: ECUserSession,
    @Body() body: StockPriceDto,
    @GetUser() user?: User,
  ) {
    return await this.service.price(session, body, user);
  }

  @ApiOperation({ description: 'show stock by given id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(
    @GetECSession() session: ECUserSession,
    @Param('id') entityId: bigint,
  ) {
    return await this.service.findById(session, entityId);
  }

  @ApiOperation({ description: 'set new stock' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetECSession() session: ECUserSession, @Body() dto: StockDto) {
    return await this.service.create(session, dto);
  }

  @ApiOperation({ description: 'delete stock' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(
    @GetECSession() session: ECUserSession,
    @Param('id') entityId: bigint,
  ) {
    return await this.service.deleteById(session, entityId);
  }
}
