import { Inject, Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { GSPaymentServiceManualProviderFactory } from './gs-payment-service-manual-provider.factory';

@Injectable({ scope: Scope.REQUEST })
export class GSPaymentServiceProviderFactory {
  constructor(
    @Inject(REQUEST)
    private request: Request,
    private provider: GSPaymentServiceManualProviderFactory,
  ) {}

  async create() {
    const paymentGatewayId = Number(this.request?.body?.paymentGatewayId);
    return await this.provider.create(paymentGatewayId);
  }
}
