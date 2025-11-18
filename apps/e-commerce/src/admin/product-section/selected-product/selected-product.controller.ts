import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  UnprocessableEntityException,
  ValidationPipe,
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
import { Response } from 'express';
import { JwtGuard, OptionalJwtGuard } from '@rahino/auth';
import { SelectedProductService } from './selected-product.service';
import { SelectedProductDto, GetSelectedProductDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageOptions } from './file-options';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';

@ApiTags('Admin-SelectedProducts')
@Controller({
  path: '/api/ecommerce/admin/selectedProducts',
  version: ['1'],
})
export class SelectedProductController {
  constructor(private service: SelectedProductService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @CheckPermission({ permissionSymbol: 'ecommerce.selectedproducts.getall' })
  @ApiOperation({ description: 'show all selected products' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetSelectedProductDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetSelectedProductDto) {
    return await this.service.findAll(filter);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show selected products by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.selectedproducts.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'create selected products by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.selectedproducts.create' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: SelectedProductDto) {
    return await this.service.create(dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'update selected products by admin' })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.selectedproducts.update' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') entityId: number, @Body() dto: SelectedProductDto) {
    return await this.service.update(entityId, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'delete selected product by admin' })
  @Delete('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.selectedproducts.delete' })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @UseInterceptors(JsonResponseTransformInterceptor)
  @CheckPermission({
    permissionSymbol: 'ecommerce.selectedproducts.uploadImage',
  })
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
  @Post('/image/:id')
  @HttpCode(HttpStatus.OK)
  async uploadImage(
    @Param('id') id: number,
    @GetUser() user: User,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 2097152 })],
        fileIsRequired: false,
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

    return await this.service.uploadImage(id, user, file);
  }

  @ApiOperation({ description: 'show selected product photo by fileName' })
  @Get('/image/:fileName')
  @HttpCode(HttpStatus.OK)
  async getImage(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ) {
    return { ok: true };
  }
}
