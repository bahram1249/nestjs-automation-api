import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { LogisticPaymentServiceManualProviderFactory } from './logistic-payment-service-manual-provider.factory';

@Injectable({ scope: Scope.REQUEST })
export class LogisticPaymentServiceProviderFactory {
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    private readonly provider: LogisticPaymentServiceManualProviderFactory,
  ) {}

  async create() {
    if (!this.request?.body?.paymentId) return null;
    const paymentId = Number(this.request?.body?.paymentId);
    return await this.provider.create(paymentId);
  }
}
