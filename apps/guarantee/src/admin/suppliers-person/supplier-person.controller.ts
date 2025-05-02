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
import { GetUser, JwtGuard } from '@rahino/auth';
import { GetSupplierPersonDto, SupplierPersonDto } from './dto';
import { SupplierPersonService } from './supplier-person.service';
import { User } from '@rahino/database';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-SupplierPerson')
@Controller({
  path: '/api/guarantee/admin/supplierPersons',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class SupplierPersonController {
  constructor(private service: SupplierPersonService) {}

  @ApiOperation({ description: 'show all suppliers person' })
  @CheckPermission({ permissionSymbol: 'gs.admin.supplierpersons.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetSupplierPersonDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetSupplierPersonDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show supplier person by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.supplierpersons.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: number) {
    return await this.service.findById(user, entityId);
  }

  @ApiOperation({ description: 'create supplier person' })
  @CheckPermission({ permissionSymbol: 'gs.admin.supplierpersons.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: SupplierPersonDto) {
    return await this.service.create(user, dto);
  }

  @ApiOperation({ description: 'update supplier person by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.supplierpersons.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() dto: SupplierPersonDto,
  ) {
    return await this.service.updateById(user, id, dto);
  }

  @ApiOperation({ description: 'delete supplier person by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.supplierpersons.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@GetUser() user: User, @Param('id') entityId: number) {
    return await this.service.deleteById(user, entityId);
  }
}
