import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { CartableService } from './cartable.service';
import { GetCartableDto } from '../../shared/cartable-filtering/dto';
import { User } from '@rahino/database';
import { GetCartableExternalDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-Cartable')
@Controller({
  path: '/api/guarantee/admin/cartables',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class CartableController {
  constructor(private service: CartableService) {}

  @ApiOperation({ description: 'show all cartable' })
  @CheckPermission({ permissionSymbol: 'gs.admin.cartables.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetCartableExternalDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @GetUser() user: User,
    @Query() filter: GetCartableExternalDto,
  ) {
    return await this.service.findAll(user, filter);
  }
}
