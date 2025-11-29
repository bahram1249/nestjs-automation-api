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
import { NodeConditionService } from './node-condition.service';
import { GetNodeConditionDto } from './dto/get-node-condition.dto';

@ApiTags('BPMN - Node Conditions')
@Controller({ path: '/api/bpmn/node-conditions', version: ['1'] })
export class NodeConditionController {
  constructor(private readonly service: NodeConditionService) {}

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'List node conditions' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetNodeConditionDto) {
    return this.service.findAll(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Lookup node conditions' })
  @Get('/lookup')
  @HttpCode(HttpStatus.OK)
  async lookup(@Query() filter: GetNodeConditionDto) {
    return this.service.lookup(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get node condition by ids' })
  @Get('/:nodeId/:conditionId')
  @HttpCode(HttpStatus.OK)
  async findById(
    @Param('nodeId') nodeId: number,
    @Param('conditionId') conditionId: number,
  ) {
    return this.service.findById(Number(nodeId), Number(conditionId));
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create node condition' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: any) {
    return this.service.create(body);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Update node condition' })
  @Put('/:nodeId/:conditionId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('nodeId') nodeId: number,
    @Param('conditionId') conditionId: number,
    @Body() body: any,
  ) {
    return this.service.update(Number(nodeId), Number(conditionId), body);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Delete node condition' })
  @Delete('/:nodeId/:conditionId')
  @HttpCode(HttpStatus.OK)
  async delete(
    @Param('nodeId') nodeId: number,
    @Param('conditionId') conditionId: number,
  ) {
    return this.service.delete(Number(nodeId), Number(conditionId));
  }
}
