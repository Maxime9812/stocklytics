import { Body, Controller, Post, Session } from '@nestjs/common';
import { Public } from '@app/authentication/infra/clients/nestjs/metadata/public.metadata';
import { RegisterUserDto } from '@app/authentication/infra/clients/nestjs/dtos/register-user.dto';
import { RegisterUserUseCase } from '@app/authentication/hexagon/usecases/register-user/register-user.usecase';

@Controller('auth')
export class AuthController {
  constructor(private readonly registerUserUseCase: RegisterUserUseCase) {}

  @Public()
  @Post('login')
  login(@Session() sess: Record<string, any>) {
    sess.userId = 'f86a8562-8d11-429b-9dd0-0dbb0e69bc7a';
  }

  @Public()
  @Post('register')
  async register(
    @Session() sess: Record<string, any>,
    @Body() body: RegisterUserDto,
  ) {
    const { email, password } = body;
    await this.registerUserUseCase.execute({
      email,
      password,
    });
  }

  @Post('logout')
  logout(@Session() sess: Record<string, any>) {
    sess.userId = null;
  }
}
