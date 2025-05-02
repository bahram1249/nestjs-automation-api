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
import { RevertToTechnicalUserService } from './revert-to-technical-user.service';
import { RevertToTechncialUserDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-RevertToTechnicalUser')
@Controller({
  path: '/api/guarantee/cartable/revertToTechnicalUser',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class RevertToTechnicalUserController {
  constructor(private service: RevertToTechnicalUserService) {}

  @ApiOperation({ description: 'revert to technical user' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async traverse(@GetUser() user: User, @Body() dto: RevertToTechncialUserDto) {
    return await this.service.traverse(user, dto);
  }
}
