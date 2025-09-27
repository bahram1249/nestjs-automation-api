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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { JwtGuard } from '@rahino/auth';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { NodeService } from './node.service';
import { CreateNodeDto, GetNodeDto, UpdateNodeDto } from './dto';

@ApiTags('BPMN - Nodes')
@Controller({ path: '/api/bpmn/nodes', version: ['1'] })
export class NodeController {
  constructor(private readonly service: NodeService) {}

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'List nodes' })
  //@CheckPermission({ permissionSymbol: 'bpmn.nodes.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetNodeDto) {
    return this.service.findAll(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get node by id' })
  //@CheckPermission({ permissionSymbol: 'bpmn.nodes.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create node' })
  //@CheckPermission({ permissionSymbol: 'bpmn.nodes.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateNodeDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Update node' })
  //@CheckPermission({ permissionSymbol: 'bpmn.nodes.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: UpdateNodeDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Delete node (soft)' })
  //@CheckPermission({ permissionSymbol: 'bpmn.nodes.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    return this.service.deleteById(id);
  }
}
