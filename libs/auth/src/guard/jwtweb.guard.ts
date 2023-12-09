import { AuthGuard } from '@nestjs/passport';

export class JwtWebGuard extends AuthGuard('jwtweb') {
  constructor() {
    super();
  }
}
