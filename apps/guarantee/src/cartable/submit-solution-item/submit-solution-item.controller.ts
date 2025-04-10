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
import { SubmitSolutionItemDto } from './dto';
import { User } from '@rahino/database';
import { SubmitSolutionItemService } from './submit-solution-item.service';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-Submit-Solution-Item')
@Controller({
  path: '/api/guarantee/cartable/submitSolutionItem',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class SubmitSolutionItemController {
  constructor(private service: SubmitSolutionItemService) {}

  @ApiOperation({ description: 'submit solution to request' })
  @Post('/')
  @HttpCode(HttpStatus.OK)
  async traverse(@GetUser() user: User, @Body() dto: SubmitSolutionItemDto) {
    return await this.service.traverse(user, dto);
  }
}
