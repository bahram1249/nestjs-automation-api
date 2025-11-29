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
import { RequestStateCrudService } from './request-state.service';
import { GetRequestStateDto } from './dto/get-request-state.dto';
import { CreateRequestStateDto } from './dto/create-request-state.dto';
import { UpdateRequestStateDto } from './dto/update-request-state.dto';

@ApiTags('BPMN - Request States')
@Controller({ path: '/api/bpmn/request-states', version: ['1'] })
export class RequestStateController {
  constructor(private readonly service: RequestStateCrudService) {}

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'List request states' })
  //@CheckPermission({ permissionSymbol: 'bpmn.requestStates.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: GetRequestStateDto) {
    return this.service.findAll(query);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get request state by id' })
  //@CheckPermission({ permissionSymbol: 'bpmn.requestStates.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create request state' })
  //@CheckPermission({ permissionSymbol: 'bpmn.requestStates.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRequestStateDto) {
    return this.service.create(dto as any);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Update request state' })
  //@CheckPermission({ permissionSymbol: 'bpmn.requestStates.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') id: number, @Body() dto: UpdateRequestStateDto) {
    return this.service.update(id, dto as any);
  }

  // Optional create/update/delete for RequestState if needed by admins
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Delete request state (hard delete)' })
  //@CheckPermission({ permissionSymbol: 'bpmn.requestStates.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    return this.service.deleteById(id);
  }
}
