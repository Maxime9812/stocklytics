import { Body, Controller, Post } from '@nestjs/common';
import { Public } from '@app/authentication/infra/clients/nestjs/metadata/public.metadata';
import { RegisterUserDto } from '@app/authentication/infra/clients/nestjs/dtos/register-user.dto';
import { RegisterUserUseCase } from '@app/authentication/hexagon/usecases/register-user/register-user.usecase';
import { LoginUseCase } from '@app/authentication/hexagon/usecases/login/login.usecase';
import { LoginDto } from '@app/authentication/infra/clients/nestjs/dtos/login.dto';
import { LogoutUseCase } from '@app/authentication/hexagon/usecases/logout/logout.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    await this.loginUseCase.execute({ email, password });
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    const { email, password } = body;
    await this.registerUserUseCase.execute({
      email,
      password,
    });
  }

  @Post('logout')
  async logout() {
    await this.logoutUseCase.execute();
  }
}
