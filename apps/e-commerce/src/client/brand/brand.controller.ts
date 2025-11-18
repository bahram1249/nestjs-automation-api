import {
  Body,
  Controller,
  Delete,
  UnprocessableEntityException,
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
import { BrandService } from './brand.service';
import { BrandDto, GetBrandDto } from './dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageOptions } from './file-options';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { OptionalSessionGuard } from '../../user/session/guard';

@ApiTags('Brands')
@Controller({
  path: '/api/ecommerce/brands',
  version: ['1'],
})
export class BrandController {
  constructor(private service: BrandService) {}

  // public url
  @UseGuards(OptionalJwtGuard, OptionalSessionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show all brands' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetBrandDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetBrandDto) {
    return await this.service.findAll(filter);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show brand by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.brands.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'create brand by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.brands.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: BrandDto) {
    return await this.service.create(dto);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'update brand by admin' })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.brands.update' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') entityId: number, @Body() dto: BrandDto) {
    return await this.service.update(entityId, dto);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: 'delete brand by admin' })
  @Delete('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.brands.delete' })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'get brand by slug' })
  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(@Param('slug') slug: string) {
    return await this.service.findBySlug(slug);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @CheckPermission({ permissionSymbol: 'ecommerce.brands.uploadImage' })
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

  @ApiOperation({ description: 'show brand photo by fileName' })
  @Get('/image/:fileName')
  @HttpCode(HttpStatus.OK)
  async getImage(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ) {
    return { ok: true };
  }
}
