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
import { PickOrganizationDto } from './dto';
import { User } from '@rahino/database';
import { PickOrganizationService } from './pick-organization.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-PickOrganization')
@Controller({
  path: '/api/guarantee/cartable/pickOrganizations',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PickOrganizationController {
  constructor(private service: PickOrganizationService) {}

  @ApiOperation({ description: 'set an organization to request' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: PickOrganizationDto) {
    return await this.service.traverse(user, dto);
  }
}
