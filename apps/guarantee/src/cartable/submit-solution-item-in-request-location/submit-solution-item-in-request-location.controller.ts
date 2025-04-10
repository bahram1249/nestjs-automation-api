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
import { SubmitSolutionItemInRequestLocationService } from './submit-solution-item-in-request-location.service';
import { SubmitSolutionItemDto } from '@rahino/guarantee/shared/request-factor/dto/submit-solution-item.dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-Submit-Solution-Item')
@Controller({
  path: '/api/guarantee/cartable/submitSolutionItemInRequestLocation',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class SubmitSolutionItemInRequestLocationController {
  constructor(private service: SubmitSolutionItemInRequestLocationService) {}

  @ApiOperation({ description: 'submit solution to request' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async traverse(@GetUser() user: User, @Body() dto: SubmitSolutionItemDto) {
    return await this.service.traverse(user, dto);
  }
}
