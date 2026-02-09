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
import { ApiJsonResponse } from '@rahino/response';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { PayAdditionalPackageService } from './pay-additional-package.service';
import {
  PayAdditionalPackageDto,
  GuaranteeClientPayAdditionalPackageResponseDto,
} from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('GS-PayAdditionalPackage')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@UseInterceptors(JsonResponseTransformInterceptor)
@Controller({
  path: '/api/guarantee/client/payAdditionalPackages',
  version: ['1'],
})
export class PayAdditionalPackageController {
  constructor(private service: PayAdditionalPackageService) {}

  @ApiOperation({ description: 'create pay additional package by user' })
  @Post('/')
  @ApiJsonResponse({
    type: GuaranteeClientPayAdditionalPackageResponseDto,
    status: 201,
    description: 'Pay additional package created successfully',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: PayAdditionalPackageDto) {
    return await this.service.create(user, dto);
  }
}
