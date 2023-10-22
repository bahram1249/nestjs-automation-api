import { Test, TestingModule } from '@nestjs/testing';
import { UserServiceController } from './user.controller';
import { UserServiceService } from './user.service';

describe('UserServiceController', () => {
  let userServiceController: UserServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserServiceController],
      providers: [UserServiceService],
    }).compile();

    userServiceController = app.get<UserServiceController>(
      UserServiceController,
    );
  });
});
