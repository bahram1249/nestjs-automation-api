import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@rahino/database';
import { TrackingRequestService } from '@rahino/guarantee/admin/tracking-request';
import { GetTrackingRequestExternalDto } from '@rahino/guarantee/admin/tracking-request/dto';
import { HistoryService } from '@rahino/guarantee/cartable/history';
import { GetHistoryDto } from '@rahino/guarantee/cartable/history/dto';
import { GSFactorDeatilAndRemainingAmountService } from '@rahino/guarantee/cartable/factor-detail-and-amount-remaining';
import { Buffer as NodeBuffer } from 'buffer';
import * as path from 'path';
import PdfPrinter = require('@digicole/pdfmake-rtl');

@Injectable()
export class CartablePdfService {
  private readonly printer: any;

  constructor(
    private readonly trackingRequestService: TrackingRequestService,
    private readonly historyService: HistoryService,
    private readonly factorRemainingService: GSFactorDeatilAndRemainingAmountService,
  ) {
    const vazirmatnRegular = path.resolve(
      process.cwd(),
      'assets/fonts/Vazirmatn-Regular.ttf',
    );
    const vazirmatnBold = path.resolve(
      process.cwd(),
      'assets/fonts/Vazirmatn-Bold.ttf',
    );

    const fonts = {
      Vazirmatn: {
        normal: vazirmatnRegular,
        bold: vazirmatnBold,
        italics: vazirmatnRegular,
        bolditalics: vazirmatnBold,
      },
      // pdfmake-rtl may internally reference the "Nillima" font for certain scripts;
      // map it to Vazirmatn files so those references are satisfied.
      Nillima: {
        normal: vazirmatnRegular,
        bold: vazirmatnBold,
        italics: vazirmatnRegular,
        bolditalics: vazirmatnBold,
      },
    };

    this.printer = new (PdfPrinter as any)(fonts);
  }

  async generateRequestPdf(user: User, requestId: bigint): Promise<Buffer> {
    const trackingFilter = new GetTrackingRequestExternalDto();
    (trackingFilter as any).requestId = requestId;
    (trackingFilter as any).limit = 1;
    (trackingFilter as any).offset = 0;

    const trackingResponse = await this.trackingRequestService.findAll(
      user,
      trackingFilter as any,
    );

    const trackingItems: any[] = trackingResponse?.result ?? [];
    if (!trackingItems.length) {
      throw new BadRequestException('invalid request id');
    }

    const tracking = trackingItems[0];

    const historyFilter = new GetHistoryDto();
    (historyFilter as any).ignorePaging = true;
    (historyFilter as any).orderBy = 'createdAt';
    (historyFilter as any).sortOrder = 'ASC';

    const historyResponse = await this.historyService.findAll(
      requestId,
      historyFilter as any,
    );
    const histories: any[] = historyResponse?.result ?? [];

    let factorBlock: any = null;
    try {
      const factorResponse =
        await this.factorRemainingService.findFactorDeatilAndRemainingAmount(
          requestId,
        );
      if (factorResponse && factorResponse.result) {
        factorBlock = factorResponse.result;
      }
    } catch (e) {
      if (!(e instanceof BadRequestException)) {
        throw e;
      }
    }

    const model = this.buildModel(tracking, histories, factorBlock);
    return this.buildPdf(model);
  }

  private buildModel(tracking: any, histories: any[], factorBlock: any) {
    const request = tracking?.guaranteeRequest ?? {};
    const user = request.user ?? {};
    const guarantee = request.guarantee ?? {};
    const address = request.address ?? {};
    const province = address.province ?? {};
    const city = address.city ?? {};
    const neighborhood = address.neighborhood ?? {};
    const clientShipmentWay = request.clientShipmentWay ?? {};
    const cartableShipmentWay = request.cartableShipmentWay ?? {};
    const requestItems = request.requestItems ?? [];

    const fullAddressParts = [
      province.name,
      city.name,
      neighborhood.name,
      address.street,
      address.alley,
      address.plaque,
      address.floorNumber,
      address.postalCode,
    ].filter((x) => x != null && x !== '');
    const fullAddress = fullAddressParts.join('، ');

    return {
      request: {
        id: request.id,
        createdAt: request.createdAt,
        requestTypeTitle: request.requestType?.title,
        requestCategoryTitle: request.requestCategory?.title,
        brandTitle: request.brand?.title,
        variantTitle: request.variant?.title,
        productTypeTitle: request.productType?.title,
        serialNumber: guarantee.serialNumber,
        userFullName: [user.firstname, user.lastname]
          .filter((x) => x != null && x !== '')
          .join(' '),
        nationalCode: user.nationalCode,
        phoneNumber: user.phoneNumber,
        clientShipmentWayTitle: clientShipmentWay.title,
        cartableShipmentWayTitle: cartableShipmentWay.title,
        fullAddress,
        requestItems: requestItems.map((item: any) => ({
          description: item.description,
          requestItemTypeTitle: item.requestItemType?.title,
          createdByUserFullName: item.user
            ? [item.user.firstname, item.user.lastname]
                .filter((x: string) => x != null && x !== '')
                .join(' ')
            : null,
        })),
      },
      currentActivity: tracking.activity,
      histories,
      factorBlock,
    };
  }

  private buildPdf(model: any): Promise<Buffer> {
    const docDefinition: any = {
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        font: 'Vazirmatn',
        alignment: 'right',
      },
      content: [
        {
          text: 'گزارش درخواست گارانتی',
          fontSize: 16,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            [
              { text: `شماره درخواست: ${model.request.id ?? '-'}` },
              {
                text: `تاریخ ثبت: ${this.formatDateTime(
                  model.request.createdAt,
                )}`,
              },
              {
                text: `وضعیت فعلی: ${
                  model.currentActivity?.activity?.name ??
                  model.currentActivity?.name ??
                  '-'
                }`,
              },
            ],
            [
              { text: `نام مشتری: ${model.request.userFullName ?? '-'}` },
              { text: `کد ملی: ${model.request.nationalCode ?? '-'}` },
              { text: `تلفن همراه: ${model.request.phoneNumber ?? '-'}` },
            ],
          ],
          columnGap: 20,
          margin: [0, 0, 0, 10],
        },
        {
          text: 'مشخصات محصول و گارانتی',
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 4],
        },
        {
          ul: [
            `نوع درخواست: ${model.request.requestTypeTitle ?? '-'}`,
            `دسته‌بندی: ${model.request.requestCategoryTitle ?? '-'}`,
            `برند / مدل / نوع: ${
              [
                model.request.brandTitle,
                model.request.variantTitle,
                model.request.productTypeTitle,
              ]
                .filter((x: string) => x != null && x !== '')
                .join(' / ') || '-'
            }`,
            `سریال کارت گارانتی: ${model.request.serialNumber ?? '-'}`,
            `روش ارسال مشتری: ${model.request.clientShipmentWayTitle ?? '-'}`,
            `روش ارسال کارتابل: ${
              model.request.cartableShipmentWayTitle ?? '-'
            }`,
          ],
          margin: [0, 0, 0, 10],
        },
        {
          text: 'آدرس',
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 4],
        },
        {
          text: model.request.fullAddress || '-',
          margin: [0, 0, 0, 10],
        },
        {
          text: 'آیتم‌های درخواست',
          fontSize: 12,
          bold: true,
          margin: [0, 10, 0, 4],
        },
        model.request.requestItems && model.request.requestItems.length
          ? {
              table: {
                headerRows: 1,
                widths: ['*', 'auto', 'auto'],
                body: [
                  ['شرح آیتم', 'نوع آیتم', 'کاربر ثبت‌کننده'],
                  ...model.request.requestItems.map((i: any) => [
                    i.description ?? '-',
                    i.requestItemTypeTitle ?? '-',
                    i.createdByUserFullName ?? '-',
                  ]),
                ],
              },
            }
          : { text: 'آیتمی برای این درخواست ثبت نشده است.' },
        {
          text: 'تاریخچه درخواست',
          fontSize: 12,
          bold: true,
          margin: [0, 15, 0, 4],
        },
        model.histories && model.histories.length
          ? {
              table: {
                headerRows: 1,
                widths: ['auto', '*', '*', '*'],
                body: [
                  ['تاریخ', 'از', 'به', 'دستور'],
                  ...model.histories.map((h: any) => [
                    this.formatDateTime(h.createdAt),
                    h.fromTitle ?? '-',
                    h.toTitle ?? '-',
                    h.nodeCommandName ?? '-',
                  ]),
                ],
              },
              layout: 'lightHorizontalLines',
            }
          : { text: 'تاریخی برای این درخواست ثبت نشده است.' },
        {
          text: 'فاکتور و پرداخت‌ها',
          fontSize: 12,
          bold: true,
          margin: [0, 15, 0, 4],
        },
        model.factorBlock
          ? this.buildFactorSection(model.factorBlock)
          : { text: 'برای این درخواست هنوز فاکتوری ثبت نشده است.' },
      ],
    };

    const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
    const chunks: Uint8Array[] = [];

    return new Promise((resolve, reject) => {
      pdfDoc.on('data', (chunk: Uint8Array) => {
        chunks.push(chunk);
      });
      pdfDoc.on('end', () => {
        resolve(NodeBuffer.concat(chunks));
      });
      pdfDoc.on('error', (err: any) => {
        reject(err);
      });
      pdfDoc.end();
    });
  }

  private buildFactorSection(factorBlock: any) {
    const services: any[] = [];

    if (Array.isArray(factorBlock.solutionServices)) {
      services.push(
        ...factorBlock.solutionServices.map((s: any) => ({
          title: s.title,
          qty: s.qty,
          totalPrice: s.totalPrice,
          warrantyServiceTypeTitle: s.warrantyServiceTypeTitle,
        })),
      );
    }

    if (Array.isArray(factorBlock.partServices)) {
      services.push(
        ...factorBlock.partServices.map((s: any) => ({
          title: s.title,
          qty: s.qty,
          totalPrice: s.totalPrice,
          warrantyServiceTypeTitle: s.warrantyServiceTypeTitle,
        })),
      );
    }

    const serviceTable =
      services.length > 0
        ? {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', '*'],
              body: [
                ['خدمت / قطعه', 'تعداد', 'مبلغ', 'نوع خدمت گارانتی'],
                ...services.map((s) => [
                  s.title ?? '-',
                  s.qty ?? '-',
                  this.formatPrice(s.totalPrice),
                  s.warrantyServiceTypeTitle ?? '-',
                ]),
              ],
            },
            layout: 'lightHorizontalLines',
            margin: [0, 5, 0, 5],
          }
        : { text: 'جزئیات خدمات برای فاکتور موجود نیست.' };

    const transactions = Array.isArray(factorBlock.transactions)
      ? factorBlock.transactions
      : [];

    const transactionTable =
      transactions.length > 0
        ? {
            table: {
              headerRows: 1,
              widths: ['auto', '*', 'auto'],
              body: [
                ['شناسه تراکنش', 'درگاه پرداخت', 'مبلغ'],
                ...transactions.map((t: any) => [
                  t.transactionId ?? '-',
                  t.paymentGatewayTitle ?? '-',
                  this.formatPrice(t.price),
                ]),
              ],
            },
            layout: 'lightHorizontalLines',
            margin: [0, 5, 0, 0],
          }
        : { text: 'تراکنشی برای این فاکتور ثبت نشده است.' };

    return {
      stack: [
        {
          columns: [
            [
              `شماره فاکتور: ${factorBlock.factor?.id ?? '-'}`,
              `مبلغ کل: ${this.formatPrice(factorBlock.factor?.totalPrice)}`,
            ],
            [
              `مبلغ باقیمانده: ${this.formatPrice(
                factorBlock.remainingAmount,
              )}`,
              `امکان پرداخت آنلاین: ${
                factorBlock.isAvailableForOnlinePayment ? 'بله' : 'خیر'
              }`,
            ],
          ],
          columnGap: 20,
        },
        serviceTable,
        transactionTable,
      ],
    };
  }

  private formatDateTime(value: any): string {
    if (!value) {
      return '-';
    }

    const d = new Date(value);
    if (Number.isNaN(d.getTime())) {
      return '-';
    }

    return d.toLocaleString('fa-IR');
  }

  private formatPrice(value: any): string {
    if (value == null) {
      return '-';
    }

    const n = Number(value);
    if (Number.isNaN(n)) {
      return '-';
    }

    return n.toLocaleString('en-US');
  }
}
