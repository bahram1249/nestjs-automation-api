import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
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
import { AdminLogisticUserService } from './admin-logistic-user.service';
import { CreateLogisticUserDto, GetLogisticUserDto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('AdminLogisticUser')
@UseGuards(JwtGuard, PermissionGuard)
@UseInterceptors(JsonResponseTransformInterceptor)
@ApiBearerAuth()
@Controller({
  path: '/api/ecommerce/admin/logisticUsers',
  version: ['1'],
})
export class AdminLogisticUserController {
  constructor(private service: AdminLogisticUserService) {}

  @ApiOperation({ description: 'show all logistic users' })
  @CheckPermission({ permissionSymbol: 'ecommerce.logisticusers.getall' })
  @Get('/:logisticId')
  @ApiQuery({
    name: 'filter',
    type: GetLogisticUserDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() filter: GetLogisticUserDto,
    @Param('logisticId') logisticId: bigint,
  ) {
    return await this.service.findAll(logisticId, filter);
  }

  @ApiOperation({ description: 'create logistic user by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.logisticusers.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: CreateLogisticUserDto) {
    return await this.service.create(user, dto);
  }

  @ApiOperation({ description: 'delete logistics user by admin' })
  @Delete('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.logisticusers.delete' })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: bigint) {
    return await this.service.deleteById(entityId);
  }
}
