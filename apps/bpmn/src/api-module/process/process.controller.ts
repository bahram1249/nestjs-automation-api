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
  Version,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { JwtGuard } from '@rahino/auth';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { ProcessService } from './process.service';
import { CreateProcessDto, GetProcessDto, UpdateProcessDto } from './dto';

@ApiTags('BPMN - Processes')
@Controller({ path: '/api/bpmn/processes', version: ['1'] })
export class ProcessController {
  constructor(private readonly service: ProcessService) {}

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'List processes' })
  //@CheckPermission({ permissionSymbol: 'bpmn.processes.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: GetProcessDto) {
    return this.service.findAll(query);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Lookup processes for pickers' })
  @Get('/lookup')
  @HttpCode(HttpStatus.OK)
  async lookup(@Query() filter: GetProcessDto) {
    return this.service.lookup(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get process by id' })
  //@CheckPermission({ permissionSymbol: 'bpmn.processes.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get process activity graph' })
  @Get('/:id/graph')
  @HttpCode(HttpStatus.OK)
  async graph(
    @Param('id') id: number,
    @Query('inbound') inbound?: string,
    @Query('outbound') outbound?: string,
    @Query('nodeConditions') nodeConditions?: string,
    @Query('nodeCommands') nodeCommands?: string,
  ) {
    const toBool = (v?: string) => v === '1' || v === 'true' || v === 'on';
    return this.service.graph(Number(id), {
      inbound: toBool(inbound),
      outbound: toBool(outbound),
      nodeConditions: toBool(nodeConditions),
      nodeCommands: toBool(nodeCommands),
    });
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create process' })
  //@CheckPermission({ permissionSymbol: 'bpmn.processes.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateProcessDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Update process' })
  //@CheckPermission({ permissionSymbol: 'bpmn.processes.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: UpdateProcessDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Delete process' })
  //@CheckPermission({ permissionSymbol: 'bpmn.processes.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    return this.service.deleteById(id);
  }
}
