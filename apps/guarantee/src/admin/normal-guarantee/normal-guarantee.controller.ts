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
import { NormalGuaranteeService } from './normal-guarantee.service';
import { GetNoramlGuaranteeDto, NoramlGuaranteeDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-NormalGuarantees')
@Controller({
  path: '/api/guarantee/admin/normalGuarantees',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class NormalGuaranteeController {
  constructor(private service: NormalGuaranteeService) {}

  @ApiOperation({ description: 'show all normal guarantees' })
  @CheckPermission({ permissionSymbol: 'gs.admin.noramlguarantees.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetNoramlGuaranteeDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetNoramlGuaranteeDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show guarantee by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.noramlguarantees.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create guarantee' })
  @CheckPermission({ permissionSymbol: 'gs.admin.noramlguarantees.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: NoramlGuaranteeDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update guarantee by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.noramlguarantees.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: number, @Body() dto: NoramlGuaranteeDto) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete guarantee by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.noramlguarantees.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}
