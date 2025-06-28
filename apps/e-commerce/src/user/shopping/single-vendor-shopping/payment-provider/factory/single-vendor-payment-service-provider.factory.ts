import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { SingleVendorPaymentServiceManualProviderFactory } from './single-vendor-payment-service-manual-provider.factory';

@Injectable({ scope: Scope.REQUEST })
export class SingleVendorPaymentServiceProviderFactory {
  constructor(
    @Inject(REQUEST)
    private request: Request,
    private provider: SingleVendorPaymentServiceManualProviderFactory,
  ) {}

  async create() {
    const paymentId = Number(this.request?.body?.paymentGatewayId);
    return await this.provider.create(paymentId);
  }
}
