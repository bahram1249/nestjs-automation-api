import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AnonymousOrganizationService } from './organization.service';
import { GetOrganizationDto } from './dto';

@ApiTags('GS-Anonymous-Organization')
@Controller({
  path: '/api/guarantee/anonymous/organizations',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class OrganizationController {
  constructor(private service: AnonymousOrganizationService) {}

  @ApiOperation({ description: 'show all organizations' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetOrganizationDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetOrganizationDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show organization details by given id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }
}
