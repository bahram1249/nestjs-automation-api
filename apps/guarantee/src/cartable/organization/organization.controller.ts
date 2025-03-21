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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { CartableOrganizationService } from './organization.service';
import { GetOrganizationDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-Organization')
@Controller({
  path: '/api/guarantee/cartable/organizations',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class OrganizationController {
  constructor(private service: CartableOrganizationService) {}

  @ApiOperation({ description: 'show all organization' })
  @Get('/request/:requestId')
  @ApiQuery({
    name: 'filter',
    type: GetOrganizationDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('requestId') requestId: bigint,
    @Query() filter: GetOrganizationDto,
  ) {
    return await this.service.findAll(requestId, filter);
  }
}
