import { Module } from '@nestjs/common';
import { GuaranteeController } from './guarantee.controller';
import { GuaranteeService } from './guarantee.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Permission } from '@rahino/database/models/core/permission.entity';
import { User } from '@rahino/database/models/core/user.entity';
import { GuaranteeProfile } from './mapper';
import { ECGuarantee } from '@rahino/database/models/ecommerce-eav/ec-guarantee.entity';
import { Attachment } from '@rahino/database/models/core/attachment.entity';
import { MinioClientModule } from '@rahino/minio-client';

@Module({
  imports: [
    SequelizeModule.forFeature([User, Permission, ECGuarantee, Attachment]),
    MinioClientModule,
  ],
  controllers: [GuaranteeController],
  providers: [GuaranteeService, GuaranteeProfile],
})
export class GuaranteeModule {}
