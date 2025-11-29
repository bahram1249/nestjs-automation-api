import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { JwtGuard } from '@rahino/auth';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { RequestCrudService } from './request.service';
import { GetRequestDto } from './dto/get-request.dto';
import { CreateRequestDto } from './dto/create-request.dto';
import { BPMNRequestService } from '../../modules/request/request.service';

@ApiTags('BPMN - Requests')
@Controller({ path: '/api/bpmn/requests', version: ['1'] })
export class RequestController {
  constructor(
    private readonly crudService: RequestCrudService,
    private readonly bpmnRequestService: BPMNRequestService,
  ) {}

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'List requests' })
  //@CheckPermission({ permissionSymbol: 'bpmn.requests.getall' })
  @Get('/')
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: GetRequestDto) {
    return this.crudService.findAll(query);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Lookup requests for pickers' })
  @Get('/lookup')
  @HttpCode(HttpStatus.OK)
  async lookup(@Query() query: GetRequestDto) {
    return this.crudService.lookup(query);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Get request by id' })
  //@CheckPermission({ permissionSymbol: 'bpmn.requests.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') id: number) {
    return this.crudService.findById(id);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Update request' })
  //@CheckPermission({ permissionSymbol: 'bpmn.requests.update' })
  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') id: number,
    @Body() dto: Partial<CreateRequestDto>,
  ) {
    return this.crudService.update(id, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Delete request' })
  //@CheckPermission({ permissionSymbol: 'bpmn.requests.delete' })
  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async delete(@Param('id') id: number) {
    return this.crudService.deleteById(id);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'Create and initialize a BPMN request' })
  //@CheckPermission({ permissionSymbol: 'bpmn.requests.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateRequestDto) {
    const created = await this.bpmnRequestService.initRequest({
      userId: BigInt(dto.userId),
      organizationId: dto.organizationId,
      processId: dto.processId,
      description: dto.description,
    });
    return { result: created };
  }
}
