import { Module } from '@nestjs/common';
import { ShoppingCartService } from './shopping-cart.service';
import { ShoppingCartController } from './shopping-cart.controller';
import { LocalizationModule } from 'apps/main/src/common/localization';
import { AddressModule } from '../../address/address.module';
import { SessionModule } from '../../session/session.module';
import { DBLoggerModule } from '@rahino/logger';

@Module({
  imports: [LocalizationModule, AddressModule, SessionModule, DBLoggerModule],
  controllers: [ShoppingCartController],
  providers: [ShoppingCartService],
})
export class ShoppingCartModule {}
