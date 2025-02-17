import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { PaymentServiceManualProviderFactory } from './payment-service-manual-provider.factory';

@Injectable({ scope: Scope.REQUEST })
export class PaymentServiceProviderFactory {
  constructor(
    @Inject(REQUEST)
    private request: Request,
    private provider: PaymentServiceManualProviderFactory,
  ) {}

  async create() {
    const paymentId = Number(this.request?.body?.paymentId);
    return await this.provider.create(paymentId);
  }
}
