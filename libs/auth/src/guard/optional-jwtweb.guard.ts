import { AuthGuard } from '@nestjs/passport';

export class OptionalJwtWebGuard extends AuthGuard('jwtweb') {
  handleRequest(err, user, info, context) {
    return user || null; // Return null on error or no user
  }
}
