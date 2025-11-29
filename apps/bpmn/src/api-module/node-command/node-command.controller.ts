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
import { NodeCommandService } from './node-command.service';
import { GetNodeCommandDto } from './dto/get-node-command.dto';

@ApiTags('BPMN - Node Commands')
@Controller({ path: '/api/bpmn/node-commands', version: ['1'] })
export class NodeCommandController {
  constructor(private readonly service: NodeCommandService) {}

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'List node commands' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetNodeCommandDto) {
    return this.service.findAll(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Lookup node commands' })
  @Get('/lookup')
  @HttpCode(HttpStatus.OK)
  async lookup(@Query() filter: GetNodeCommandDto) {
    return this.service.lookup(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get node command by id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return this.service.findById(Number(id));
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create node command' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: any) {
    return this.service.create(body);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Update node command' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() body: any) {
    return this.service.update(Number(id), body);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Delete node command' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    return this.service.deleteById(Number(id));
  }
}
