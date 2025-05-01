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
import { RequestAttachmentService } from './request-attachment.service';
import { GSRequestAttachmentDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-RequestAttachment')
@Controller({
  path: '/api/guarantee/cartable/requestAttachments',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class RequestAttachmentController {
  constructor(private service: RequestAttachmentService) {}

  @ApiOperation({ description: 'show all attachments for a request. ' })
  @Get('/requestId/:requestId')
  @ApiQuery({
    name: 'filter',
    type: GSRequestAttachmentDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Param('requestId') requestId: bigint,
    @Query() filter: GSRequestAttachmentDto,
  ) {
    return await this.service.findAll(requestId, filter);
  }
}
