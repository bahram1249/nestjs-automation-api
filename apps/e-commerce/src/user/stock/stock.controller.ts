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
import { StockDto } from './dto';
import { StockService } from './stock.service';

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
