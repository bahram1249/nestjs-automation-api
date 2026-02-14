import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { RequestAttachmentService } from './request-attachment.service';
import { GSRequestAttachmentDto } from './dto';
import { ApiJsonResponse } from '@rahino/response';
import { GuaranteeClientRequestAttachmentListResponseDto } from './dto';
import { User } from '@rahino/database';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('GS-Cartable-RequestAttachment')
@Controller({
  path: '/api/guarantee/client/requestAttachments',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class RequestAttachmentController {
  constructor(private service: RequestAttachmentService) {}

  @ApiOperation({ description: 'show all attachments for a request. ' })
  @ApiJsonResponse({ type: GuaranteeClientRequestAttachmentListResponseDto })
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
    @GetUser() user: User,
    @Query() filter: GSRequestAttachmentDto,
  ) {
    return await this.service.findAll(requestId, user, filter);
  }

  @ApiOperation({ description: 'show request guarantee photo by fileName' })
  @Get('/image/:fileName')
  @HttpCode(HttpStatus.OK)
  async getImage(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ) {
    return {
      ok: true,
    };
  }
}
