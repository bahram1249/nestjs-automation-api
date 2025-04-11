import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { User } from '@rahino/database';
import { SubmitFactorInRequestLocationService } from './submit-factor-in-request-location.service';
import { SubmitFactorInRequestLocationDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-Submit-InRequestLocation')
@Controller({
  path: '/api/guarantee/cartable/submitFactorInRequestLocation',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class SubmitFactorInRequestLocationController {
  constructor(private service: SubmitFactorInRequestLocationService) {}

  @ApiOperation({ description: 'submit factor in request location' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async traverse(
    @GetUser() user: User,
    @Body() dto: SubmitFactorInRequestLocationDto,
  ) {
    return await this.service.traverse(user, dto);
  }
}
