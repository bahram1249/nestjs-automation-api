import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiJsonResponse } from '@rahino/response';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { AssignedProductGuaranteeService } from './assigned-product-guarantee.service';
import {
  AssignedProductGuaranteeDto,
  GetAssignedProductGuarantee,
  GuaranteeClientAssignedProductGuaranteeResponseDto,
} from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('GS-Client-Assigned-Product-AssignedGuarantee')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/guarantee/client/assignedProductGuarantees',
  version: ['1'],
})
export class AssignedProductGuaranteeController {
  constructor(private service: AssignedProductGuaranteeService) {}

  // public url
  @ApiOperation({ description: 'show all assignedProductGuarantees' })
  @Get('/guarantee/:guaranteeId')
  @ApiQuery({
    name: 'filter',
    type: GetAssignedProductGuarantee,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({
    type: GuaranteeClientAssignedProductGuaranteeResponseDto,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('guaranteeId') guaranteeId: bigint,
    @GetUser() user: User,
    @Query() filter: GetAssignedProductGuarantee,
  ) {
    return await this.service.findAll(user, guaranteeId, filter);
  }

  @ApiOperation({ description: 'show assigned product guarantees by given id' })
  @Get('/:id')
  @ApiJsonResponse({ type: GuaranteeClientAssignedProductGuaranteeResponseDto })
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(user, entityId);
  }

  @ApiOperation({ description: 'create assigened guarantee by user' })
  @Post('/')
  @ApiJsonResponse({
    type: GuaranteeClientAssignedProductGuaranteeResponseDto,
    status: 201,
  })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: User,
    @Body() dto: AssignedProductGuaranteeDto,
  ) {
    return await this.service.create(user, dto);
  }

  @ApiOperation({ description: 'delete assigned guarantee product by user' })
  @Delete('/:id')
  @ApiJsonResponse({ type: GuaranteeClientAssignedProductGuaranteeResponseDto })
  @HttpCode(HttpStatus.OK)
  async deleteById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.deleteById(user, entityId);
  }
}
