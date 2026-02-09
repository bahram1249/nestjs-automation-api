import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { FactorService } from './client-factor.service';
import {
  GetFactorDto,
  GuaranteeClientFactorListResponseDto,
  GuaranteeClientFactorSingleResponseDto,
} from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('GS-Client-Factor')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/guarantee/client/factors',
  version: ['1'],
})
export class FactorController {
  constructor(private service: FactorService) {}

  // public url
  @ApiOperation({ description: 'show all client factors' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetFactorDto,
    style: 'deepObject',
    explode: true,
  })
  @ApiJsonResponse({
    type: GuaranteeClientFactorListResponseDto,
    description: 'List of factors retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetFactorDto) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'show factor by given id' })
  @Get('/:id')
  @ApiJsonResponse({
    type: GuaranteeClientFactorSingleResponseDto,
    description: 'Factor retrieved successfully',
  })
  @HttpCode(HttpStatus.OK)
  async findById(@GetUser() user: User, @Param('id') entityId: bigint) {
    return await this.service.findById(user, entityId);
  }
}
