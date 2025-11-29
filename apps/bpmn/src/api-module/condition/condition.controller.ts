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
import { ConditionService } from './condition.service';
import { GetConditionDto } from './dto/get-condition.dto';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';

@ApiTags('BPMN - Conditions')
@Controller({ path: '/api/bpmn/conditions', version: ['1'] })
export class ConditionController {
  constructor(private readonly service: ConditionService) {}

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'List conditions' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetConditionDto) {
    return this.service.findAll(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Lookup conditions' })
  @Get('/lookup')
  @HttpCode(HttpStatus.OK)
  async lookup(@Query() filter: GetConditionDto) {
    return this.service.lookup(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get condition by id' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create condition' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateConditionDto) {
    return this.service.create(dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Update condition' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: UpdateConditionDto) {
    return this.service.update(id, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Delete condition' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    return this.service.deleteById(id);
  }
}
