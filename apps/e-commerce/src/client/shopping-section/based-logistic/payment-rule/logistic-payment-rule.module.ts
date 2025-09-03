import { Module } from '@nestjs/common';
import { ClientValidateAddressModule } from '../validate-address/client-validate-address.module';
import { ClientValidateAddressService } from '../validate-address/client-validate-address.service';

@Module({
  imports: [ClientValidateAddressModule],
  // Do not re-provide the service here; re-export the module to expose its providers
  providers: [],
  exports: [ClientValidateAddressModule],
})
export class LogisticPaymentRuleModule {}
