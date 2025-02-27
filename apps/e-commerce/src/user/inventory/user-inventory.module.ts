import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECVendorUser } from '@rahino/localdatabase/models';
import { UserInventoryService } from './user-inventory.service';
import { ECInventory } from '@rahino/localdatabase/models';

@Module({
  imports: [SequelizeModule.forFeature([ECVendorUser, ECInventory])],
  providers: [UserInventoryService],
  exports: [UserInventoryService],
})
export class UserInventoryModule {}
