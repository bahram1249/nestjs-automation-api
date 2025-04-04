import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { OrganizationAddressService } from './organization-address.service';
import { User } from '@rahino/database';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Client-Organization-Address')
@Controller({
  path: '/api/guarantee/client/organizationAddress',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class OrganizationAddressController {
  constructor(private service: OrganizationAddressService) {}

  @ApiOperation({ description: 'show organization address by requestId' })
  @Get('/request/:requestId')
  @HttpCode(HttpStatus.OK)
  async findAddress(
    @GetUser() user: User,
    @Param('requestId') requestId: bigint,
  ) {
    return await this.service.findAddress(user, requestId);
  }
}
