import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  UseGuards,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { JwtGuard } from '@rahino/auth';
import { Request } from 'express';
import { BasedCourierReportService } from './courier-report.service';
import { GetCourierReportDto } from '../../courier/dto';

@ApiTags('Report-Couriers-BasedLogistic')
@UseGuards(JwtGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/report/basedLogistic/couriers',
  version: ['1'],
})
export class BasedCourierReportController {
  constructor(private readonly service: BasedCourierReportService) {}

  @ApiOperation({ description: 'show all couriers report (based-logistic)' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetCourierReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Req() req: Request, @Query() filter: GetCourierReportDto) {
    return await this.service.findAll(req.user as any, filter);
  }

  @ApiOperation({ description: 'show total courier report (based-logistic)' })
  @Get('/total')
  @ApiQuery({
    name: 'filter',
    type: GetCourierReportDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async total(@Req() req: Request, @Query() filter: GetCourierReportDto) {
    return await this.service.total(req.user as any, filter);
  }
}
