import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CheckPermission } from '@rahino/permission-checker/decorator';
import { PermissionGuard } from '@rahino/permission-checker/guard';
import { JsonResponseTransformInterceptor } from '@rahino/response/interceptor';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser, JwtGuard } from '@rahino/auth';
import { CartableService } from './cartable.service';
import { GetCartableDto } from '../../shared/cartable-filtering/dto';
import { User } from '@rahino/database';
import { GetCartableExternalDto } from './dto';
import { CartablePdfService } from './cartable-pdf.service';
import { Response } from 'express';

@ApiBearerAuth()
@UseGuards(JwtGuard, PermissionGuard)
@ApiTags('GS-Admin-Cartable')
@Controller({
  path: '/api/guarantee/admin/cartables',
  version: ['1'],
})
export class CartableController {
  constructor(
    private service: CartableService,
    private readonly cartablePdfService: CartablePdfService,
  ) {}

  @UseInterceptors(JsonResponseTransformInterceptor)
  @ApiOperation({ description: 'show all cartable' })
  @CheckPermission({ permissionSymbol: 'gs.admin.cartables.getall' })
  @Get('/')
  @ApiQuery({
    name: 'filter',
    type: GetCartableExternalDto,
    style: 'deepObject',
    explode: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(
    @GetUser() user: User,
    @Query() filter: GetCartableExternalDto,
  ) {
    return await this.service.findAll(user, filter);
  }

  @ApiOperation({ description: 'export cartable request as PDF' })
  @CheckPermission({ permissionSymbol: 'gs.admin.cartables.getall' })
  @Get('/:requestId/pdf')
  @HttpCode(HttpStatus.OK)
  async exportRequestPdf(
    @GetUser() user: User,
    @Param('requestId') requestId: bigint,
    @Res() res: Response,
  ) {
    const buffer = await this.cartablePdfService.generateRequestPdf(
      user,
      requestId,
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="cartable-request-${requestId}.pdf"`,
    );
    res.send(buffer);
  }
}
