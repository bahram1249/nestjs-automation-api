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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OptionalJwtGuard } from '@rahino/auth';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { GetECSession } from 'apps/main/src/decorator';
import { ECUserSession } from '@rahino/localdatabase/models';
import { StockDto, StockPriceDto } from './dto';
import { StockService } from './stock.service';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { SessionGuard, SessionIgnoreUserGuard } from '../../session/guard';

@ApiTags('Stocks')
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/ecommerce/user/stocks',
  version: ['1'],
})
export class StockController {
  constructor(private readonly service: StockService) {}

  @UseGuards(OptionalJwtGuard, SessionGuard)
  @ApiOperation({ description: 'show all stocks' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@GetECSession() session: ECUserSession) {
    return await this.service.findAll(session);
  }

  @UseGuards(OptionalJwtGuard, SessionIgnoreUserGuard)
  @ApiOperation({ description: 'count all stock' })
  @Get('/count')
  @HttpCode(HttpStatus.OK)
  async count(@GetECSession() session: ECUserSession) {
    return await this.service.count(session);
  }

  @UseGuards(OptionalJwtGuard, SessionGuard)
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

  // @UseGuards(OptionalJwtGuard, SessionGuard)
  // @ApiOperation({ description: 'show stock by given id' })
  // @Get('/:id')
  // @HttpCode(HttpStatus.OK)
  // async findById(
  //   @GetECSession() session: ECUserSession,
  //   @Param('id') entityId: bigint,
  // ) {
  //   return await this.service.findById(session, entityId);
  // }

  @UseGuards(OptionalJwtGuard, SessionGuard)
  @ApiOperation({ description: 'set new stock' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetECSession() session: ECUserSession, @Body() dto: StockDto) {
    return await this.service.create(session, dto);
  }

  @UseGuards(OptionalJwtGuard, SessionGuard)
  @ApiOperation({ description: 'update stock' })
  @Put('/')
  @HttpCode(HttpStatus.CREATED)
  async update(@GetECSession() session: ECUserSession, @Body() dto: StockDto) {
    return await this.service.update(session, dto);
  }

  @UseGuards(OptionalJwtGuard, SessionGuard)
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
