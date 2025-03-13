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
import { SolutionService } from './solution.service';
import { GetSolutionDto, SolutionDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-Solutions')
@Controller({
  path: '/api/guarantee/admin/solutions',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class SolutionController {
  constructor(private service: SolutionService) {}

  @ApiOperation({ description: 'show all solution' })
  @CheckPermission({ permissionSymbol: 'gs.admin.solutions.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetSolutionDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetSolutionDto) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show solution by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.solutions.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create solution package' })
  @CheckPermission({ permissionSymbol: 'gs.admin.solutions.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: SolutionDto) {
    return await this.service.create(dto);
  }

  @ApiOperation({ description: 'update solution by given id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.solutions.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async updateById(@Param('id') id: number, @Body() dto: SolutionDto) {
    return await this.service.updateById(id, dto);
  }

  @ApiOperation({ description: 'delete solution by id' })
  @CheckPermission({ permissionSymbol: 'gs.admin.solutions.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }
}
