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
import { CartableTechnicalUserService } from './technical-user.service';
import { GetTechnicalUserDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-TechnicalUser')
@Controller({
  path: '/api/guarantee/cartable/technicalUsers',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class TechnicalUserController {
  constructor(private service: CartableTechnicalUserService) {}

  @ApiOperation({ description: 'show all techical user' })
  @Get('/request/:requestId')
  @ApiQuery({
    name: 'filter',
    type: GetTechnicalUserDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('requestId') requestId: bigint,
    @Query() filter: GetTechnicalUserDto,
  ) {
    return await this.service.findAll(requestId, filter);
  }
}
