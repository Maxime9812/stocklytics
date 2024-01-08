import { Controller, Post, Session } from '@nestjs/common';
import { Public } from '@app/authentication/infra/clients/nestjs/metadata/public.metadata';

@Controller('auth')
export class AuthController {
  @Public()
  @Post('login')
  login(@Session() sess: Record<string, any>) {
    sess.userId = 'f86a8562-8d11-429b-9dd0-0dbb0e69bc7a';
  }

  @Post('logout')
  logout(@Session() sess: Record<string, any>) {
    sess.userId = null;
  }
}
