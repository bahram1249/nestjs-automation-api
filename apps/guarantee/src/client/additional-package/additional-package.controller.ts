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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { AdditionalPackageService } from './additional-package.service';
import { GetAdditionalPackageDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Client-AdditionalPackages')
@Controller({
  path: '/api/guarantee/client/additionalPackages',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class AdditionalPackageController {
  constructor(private service: AdditionalPackageService) {}

  @ApiOperation({ description: 'show all additional package' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetAdditionalPackageDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetAdditionalPackageDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show additional package by given id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
}
