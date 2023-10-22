import { Module } from '@nestjs/common';
import { UserServiceController } from './user.controller';
import { UserServiceService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Users } from './model/user.model';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mssql',
      host: 'localhost',
      port: 1433,
      username: 'sa',
      password: 'GztsPz4G',
      database: 'nest',
      autoLoadModels: true,
      synchronize: true,
      models: [Users],
    }),
    SequelizeModule.forFeature([Users]),
  ],

  controllers: [UserServiceController],
  providers: [UserServiceService],
})
export class UserServiceModule {}
