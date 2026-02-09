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
import { ApiJsonResponse } from '@rahino/response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import {
  GetTechnicalPersonDto,
  TechnicalPersonDto,
  GuaranteeAdminTechnicalPersonResponseDto,
} from './dto';
import { TechnicalPersonService } from './technical-person.service';
import { User } from '@rahino/database';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-TechnicalPersons')
@Controller({
  path: '/api/guarantee/admin/technicalPersons',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class TechnicalPersonController {
  constructor(private service: TechnicalPersonService) {}

  @ApiOperation({ description: 'show all technical person' })
  @CheckPermission({ permissionSymbol: 'gs.admin.technicalpersons.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetTechnicalPersonDto,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({
    type: GuaranteeAdminTechnicalPersonResponseDto,
    isArray: true,
    description: 'List of technical persons retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetTechnicalPersonDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show technical person by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.technicalpersons.getone' })
  @Get('/:id')
  @ApiJsonResponse({
    type: GuaranteeAdminTechnicalPersonResponseDto,
    description: 'Technical person retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: number) {
    return await this.service.findById(user, entityId);
  }

  @ApiOperation({ description: 'create technical person' })
  @CheckPermission({ permissionSymbol: 'gs.admin.technicalpersons.create' })
  @Post('/')
  @ApiJsonResponse({
    type: GuaranteeAdminTechnicalPersonResponseDto,
    status: 201,
    description: 'Technical person created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: TechnicalPersonDto) {
    return await this.service.create(user, dto);
  }

  @ApiOperation({ description: 'update technical person by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.technicalpersons.update' })
  @Put('/:id')
  @ApiJsonResponse({
    type: GuaranteeAdminTechnicalPersonResponseDto,
    description: 'Technical person updated successfully',
  })
  @HttpCode(HttpStatus.OK)
  async updateById(
    @GetUser() user: User,
    @Param('id') id: number,
    @Body() dto: TechnicalPersonDto,
  ) {
    return await this.service.updateById(user, id, dto);
  }

  @ApiOperation({ description: 'delete technical person by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.technicalpersons.delete' })
  @Delete('/:id')
  @ApiJsonResponse({
    type: GuaranteeAdminTechnicalPersonResponseDto,
    description: 'Technical person deleted successfully',
  })
  @HttpCode(HttpStatus.OK)
  async deleteById(@GetUser() user: User, @Param('id') entityId: number) {
    return await this.service.deleteById(user, entityId);
  }
}
