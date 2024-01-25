import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { Public } from '@app/authentication/infra/clients/nestjs/metadata/public.metadata';
import { RegisterUserDto } from '@app/authentication/infra/clients/nestjs/dtos/register-user.dto';
import { RegisterUserUseCase } from '@app/authentication/hexagon/usecases/register-user/register-user.usecase';
import { LoginUseCase } from '@app/authentication/hexagon/usecases/login/login.usecase';
import { LoginDto } from '@app/authentication/infra/clients/nestjs/dtos/login.dto';
import { LogoutUseCase } from '@app/authentication/hexagon/usecases/logout/logout.usecase';
import { GetCurrentUserUseCase } from '@app/authentication/hexagon/usecases/get-current-user/get-current-user.usecase';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly getCurrentUserUseCase: GetCurrentUserUseCase,
  ) {}

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto) {
    const { email, password } = body;
    await this.loginUseCase.execute({ email, password });
    return await this.getCurrentUserUseCase.execute();
  }

  @Public()
  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    const { email, password } = body;
    await this.registerUserUseCase.execute({
      email,
      password,
    });
    return await this.getCurrentUserUseCase.execute();
  }

  @Post('logout')
  async logout(@Res() response: Response) {
    await this.logoutUseCase.execute();
    (response as any).clearCookie('session');
    await response.json();
  }

  @Get('me')
  async getCurrentUser() {
    return await this.getCurrentUserUseCase.execute();
  }
}
