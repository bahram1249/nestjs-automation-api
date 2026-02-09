import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiJsonResponse } from '@rahino/response';
import { PreRegistrationOrganizationService } from './pre-registration-organization.service';
import {
  PreRegistrationOrganizationDto,
  GuaranteeAnonymousPreRegistrationOrganizationResponseDto,
} from './dto';

@ApiTags('GS-AnonymousPreRegistrationOrganization')
@Controller({
  path: '/api/guarantee/anonymous/preRegistrationOrganizations',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PreRegistrationOrganizationController {
  constructor(private service: PreRegistrationOrganizationService) {}

  @ApiOperation({ description: 'create pre registration organization' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  @ApiJsonResponse({
    type: GuaranteeAnonymousPreRegistrationOrganizationResponseDto,
  })
  async create(@Body() dto: PreRegistrationOrganizationDto) {
    return await this.service.create(dto);
  }
}
