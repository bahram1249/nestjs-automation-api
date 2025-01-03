import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ECVendorUser } from '@rahino/database';
import { UserInventoryService } from './user-inventory.service';
import { ECInventory } from '@rahino/database';

@Module({
  imports: [SequelizeModule.forFeature([ECVendorUser, ECInventory])],
  providers: [UserInventoryService],
  exports: [UserInventoryService],
})
export class UserInventoryModule {}
