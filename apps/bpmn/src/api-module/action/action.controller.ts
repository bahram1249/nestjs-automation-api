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
import { ActionService } from './action.service';
import { GetActionDto } from './dto/get-action.dto';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';

@ApiTags('BPMN - Actions')
@Controller({ path: '/api/bpmn/actions', version: ['1'] })
export class ActionController {
  constructor(private readonly service: ActionService) {}

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'List actions' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetActionDto) {
    return this.service.findAll(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Lookup actions' })
  @Get('/lookup')
  @HttpCode(HttpStatus.OK)
  async lookup(@Query() filter: GetActionDto) {
    return this.service.lookup(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get action by id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create action' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateActionDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Update action' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: UpdateActionDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Delete action' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    return this.service.deleteById(id);
  }
}
