import { UsersRepository } from '@app/authentication/hexagon/gateways/repositories/users.repository';
import { AuthGateway } from '@app/authentication';
import { PasswordHasher } from '@app/authentication/hexagon/gateways/password-hasher';

export type LoginUseCasePayload = {
  email: string;
  password: string;
};

export class LoginUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authGateway: AuthGateway,
    private readonly passwordHasher: PasswordHasher,
  ) {}

  async execute({ email, password }: LoginUseCasePayload) {
    const user = await this.usersRepository.getByEmail(email);

    if (!user) return;

    const passwordIsInvalid = !this.passwordHasher.compare(
      password,
      user.password,
    );

    if (passwordIsInvalid) return;

    await this.authGateway.login({
      id: user.id,
      companyId: user.companyId,
    });
  }
}
