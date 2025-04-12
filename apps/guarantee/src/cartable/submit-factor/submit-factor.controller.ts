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
import { SubmitFactorService } from './submit-factor.service';
import { SubmitFactorDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-Submit-Factor')
@Controller({
  path: '/api/guarantee/cartable/submitFactor',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class SubmitFactorController {
  constructor(private service: SubmitFactorService) {}

  @ApiOperation({ description: 'submit factor' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async traverse(@GetUser() user: User, @Body() dto: SubmitFactorDto) {
    return await this.service.traverse(user, dto);
  }
}
