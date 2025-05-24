import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
  Res,
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
import { PreRegistrationOrganizationService } from './pre-registration-organization.service';
import { ConfirmDto, DeleteDto, GetPreRegistrationOrganization } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-PreRegistrationOrganization')
@Controller({
  path: '/api/guarantee/admin/preRegistrationOrganizations',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PreRegistrationOrganizationController {
  constructor(private service: PreRegistrationOrganizationService) {}

  @ApiOperation({ description: 'show all pre registrations' })
  @CheckPermission({
    permissionSymbol: 'gs.admin.preregistrationorganizations.getall',
  })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetPreRegistrationOrganization,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetPreRegistrationOrganization) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({
    description: 'show pre registration organization by given id',
  })
  @CheckPermission({
    permissionSymbol: 'gs.admin.preregistrationorganizations.getone',
  })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({
    description: 'confirm registration organization by given id',
  })
  @CheckPermission({
    permissionSymbol: 'gs.admin.preregistrationorganizations.confirm',
  })
  @Patch('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: number, @Body() confirmDto: ConfirmDto) {
    return await this.service.confirmById(id, confirmDto);
  }

  @ApiOperation({ description: 'delete pre registration organization by id' })
  @CheckPermission({
    permissionSymbol: 'gs.admin.preregistrationorganizations.delete',
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(
    @Param('id') entityId: number,
    @Body() deleteDto: DeleteDto,
  ) {
    return await this.service.deleteById(entityId, deleteDto);
  }

  @ApiOperation({ description: 'show attachment  photo by fileName' })
  @Get('/image/:fileName')
  @HttpCode(HttpStatus.OK)
  async getImage(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ) {
    return {
      ok: true,
    };
  }
}
