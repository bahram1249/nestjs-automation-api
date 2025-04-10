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
import { PickTechnicalUserDto } from './dto';
import { User } from '@rahino/database';
import { PickTechnicalUserInOrganizationService } from './pick-technical-user-in-organization.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-PickTechnicalUserInOrganization')
@Controller({
  path: '/api/guarantee/cartable/pickTechnicalUserInOrganization',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class PickTechnicalUserInOrganizationController {
  constructor(private service: PickTechnicalUserInOrganizationService) {}

  @ApiOperation({ description: 'pick TechnicalUser request' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: PickTechnicalUserDto) {
    return await this.service.traverse(user, dto);
  }
}
