import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { ConfirmRequestDto } from './dto';
import { User } from '@rahino/database';
import { ConfirmReceiveDeviceInOrganizationService } from './confirm-receive-device-in-organization.service';
import { ApiJsonResponse } from '@rahino/response';
import { GuaranteeCartableConfirmReceiveDeviceResponseDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-ConfirmReceiveDeviceInOrganization')
@Controller({
  path: '/api/guarantee/cartable/confirmReceiveDeviceInOrganization',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class ConfirmReceiveDeviceInOrganizationController {
  constructor(private service: ConfirmReceiveDeviceInOrganizationService) {}

  @ApiOperation({
    description: 'confirm receive device in organizationrequest',
  })
  @ApiJsonResponse({ type: GuaranteeCartableConfirmReceiveDeviceResponseDto })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: ConfirmRequestDto) {
    return await this.service.traverse(user, dto);
  }
}
