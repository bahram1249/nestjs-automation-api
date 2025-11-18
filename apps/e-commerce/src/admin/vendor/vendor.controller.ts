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
  UnprocessableEntityException,
  Version,
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

import { JwtGuard, OptionalJwtGuard } from '@rahino/auth';
import { VendorService } from './vendor.service';
import { VendorDto, GetVendorDto, VendorV2Dto } from './dto';
import { GetUser } from '@rahino/auth';
import { User } from '@rahino/database';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageOptions } from './file-options';
import { OptionalSessionGuard } from '../../user/session/guard';

@ApiTags('Vendors')
@Controller({
  path: '/api/ecommerce/vendors',
  version: ['1'],
})
export class VendorController {
  constructor(private service: VendorService) {}

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show all vendors' })
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetVendorDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filter: GetVendorDto) {
    return await this.service.findAll(filter);
  }

  @Version('2')
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show all vendors' })
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetVendorDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAllV2(@Query() filter: GetVendorDto) {
    return await this.service.findAllV2(filter);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show vendor by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param('id') entityId: number) {
    return await this.service.findById(entityId);
  }

  @Version('2')
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'show vendor by given id' })
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.getone' })
  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async findByIdV2(@Param('id') entityId: number) {
    return await this.service.findByIdV2(entityId);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'create color by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async create(@GetUser() user: User, @Body() dto: VendorDto) {
    return await this.service.create(user, dto);
  }

  @Version('2')
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'create color by admin' })
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.create' })
  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createV2(@GetUser() user: User, @Body() dto: VendorV2Dto) {
    return await this.service.createV2(user, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'update vendor by admin' })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.update' })
  @HttpCode(HttpStatus.OK)
  async update(@Param('id') entityId: number, @Body() dto: VendorDto) {
    return await this.service.update(entityId, dto);
  }

  @Version('2')
  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'update vendor by admin' })
  @Put('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.update' })
  @HttpCode(HttpStatus.OK)
  async updateV2(@Param('id') entityId: number, @Body() dto: VendorV2Dto) {
    return await this.service.updateV2(entityId, dto);
  }

  @UseGuards(JwtGuard, PermissionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ description: 'delete vendor by admin' })
  @Delete('/:id')
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.delete' })
  @HttpCode(HttpStatus.OK)
  async deleteById(@Param('id') entityId: number) {
    return await this.service.deleteById(entityId);
  }

  @UseGuards(OptionalJwtGuard, OptionalSessionGuard)
  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'delete vendor by admin' })
  @Get('/slug/:slug')
  @HttpCode(HttpStatus.OK)
  async findBySlug(@Param('slug') slug: string) {
    return await this.service.findBySlug(slug);
  }

  @UseInterceptors(JsonResponseTransformInterceptor)
  @UseGuards(JwtGuard, PermissionGuard)
  @ApiBearerAuth()
  @CheckPermission({ permissionSymbol: 'ecommerce.vendors.uploadImage' })
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
    @Param('id') vendorId: number,
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

    return await this.service.uploadImage(vendorId, user, file);
  }

  @ApiOperation({ description: 'show vendor photo by fileName' })
  @Get('/image/:fileName')
  @HttpCode(HttpStatus.OK)
  async getImage(
    @Res({ passthrough: true }) res: Response,
    @Param('fileName') fileName: string,
  ) {
    return { ok: true };
  }
}
