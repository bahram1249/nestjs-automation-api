import {
  Body,
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
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '@rahino/auth';
import { RequestService } from './request.service';
import {
  GetRequestFilterDto,
  NormalRequestDto,
  OutOfWarrantyRequestDto,
  VipRequestDto,
} from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageOptions } from './file-options';

@ApiTags('GS-Client-Request')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller({
  path: '/api/guarantee/client/requests',
  version: ['1'],
})
export class RequestController {
  constructor(private service: RequestService) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  // // public url
  @ApiOperation({ description: 'show all current user requests' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetRequestFilterDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@GetUser() user: User, @Query() filter: GetRequestFilterDto) {
    return await this.service.findAll(user, filter);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'create normal guarantee request' })
  @Post('/normalRequest')
  @HttpCode(HttpStatus.CREATED)
  async createNormalGuaranteeRequest(
    @GetUser() user: User,
    @Body() dto: NormalRequestDto,
  ) {
    return await this.service.createNormalGuaranteeRequest(user, dto);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'create vip guarantee request' })
  @Post('/vipRequest')
  @HttpCode(HttpStatus.CREATED)
  async createVipGuaranteeRequest(
    @GetUser() user: User,
    @Body() dto: VipRequestDto,
  ) {
    return await this.service.createVipGuaranteeRequest(user, dto);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'create out of warranty request' })
  @Post('/outOfWarrantyRequest')
  @HttpCode(HttpStatus.CREATED)
  async createOutOfWarrantyRequest(
    @GetUser() user: User,
    @Body() dto: OutOfWarrantyRequestDto,
  ) {
    return await this.service.createOutOfWarrantyRequest(user, dto);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseInterceptors(FileInterceptor('file', imageOptions()))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @Post('/image')
  @HttpCode(HttpStatus.OK)
  async uploadImage(
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 10097152 })],
        fileIsRequired: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file?: Express.Multer.File,
  ) {
    if (file && !['image/jpeg', 'image/png'].includes(file.mimetype)) {
      throw new UnprocessableEntityException(
        `Validation failed (current file type is ${file.mimetype}, expected type is /(jpg|png|jpeg)/)`,
      );
    }

    return await this.service.uploadImage(user, file);
  }

  @ApiOperation({ description: 'show guarantee  photo by fileName' })
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
