import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { JwtGuard } from '@rahino/auth/guard';
import { ListFilter } from '@rahino/query-filter';
import { BuffetService } from './buffet.service';
import { BuffetDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { coverOptions } from './file-options';
import { GetUser } from '@rahino/auth/decorator';
import { User } from '@rahino/database/models/core/user.entity';

@ApiTags('DiscountCoffe-Buffets')
@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@Controller({
  path: '/api/discountcoffe/admin/buffets',
  version: ['1'],
})
@UseInterceptors(JsonResponseTransformInterceptor)
export class BuffetController {
  constructor(private service: BuffetService) {}
  @ApiOperation({ description: 'show all buffets' })
  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.buffets.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: ListFilter,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: ListFilter) {
    return await this.service.findAll(filter);
  }

  @ApiOperation({ description: 'show buffets by given id' })
  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.buffets.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiOperation({ description: 'create buffets' })
  @CheckPermission({ permissionSymbol: 'discountcoffe.admin.buffets.create' })
  @UseInterceptors(FileInterceptor('file', coverOptions()))
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
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(
    @GetUser() user: User,
    @Body() dto: BuffetDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: /(jpg|png)/ }),
          new MaxFileSizeValidator({ maxSize: 2097152 }),
        ],
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    )
    file?: Express.Multer.File,
  ) {
    return await this.service.create(user, dto, file);
  }
}
