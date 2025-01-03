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
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '@rahino/auth';
import { GetEntityModelDto } from './dto';
import { EntityModelService } from './entity-model.service';

@ApiTags('EAV-EntityModel')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/eav/admin/entityModels',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class EntityModelController {
  constructor(private service: EntityModelService) {}
  @ApiOperation({ description: 'show all entity models' })
  @CheckPermission({ permissionSymbol: 'eav.admin.entitymodel.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetEntityModelDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetEntityModelDto) {
    return await this.service.findAll(filter);
  }
}
