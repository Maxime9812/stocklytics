import { UsersRepository } from '@app/authentication/hexagon/gateways/users.repository';
import { DateProvider } from '@app/authentication/hexagon/models/date-provider/date.provider';
import { User } from '@app/authentication/hexagon/models/user';
import { PasswordHasher } from '@app/authentication/hexagon/gateways/password-hasher';
import { UuidGenerator } from '@app/authentication/hexagon/models/uuid-generator/uuid-generator';
import { AuthGateway } from '@app/authentication';

export type RegisterUserUseCasePayload = {
  email: string;
  password: string;
};

export class RegisterUserUseCase {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly dateProvide: DateProvider,
    private readonly passwordHasher: PasswordHasher,
    private readonly uuidGenerator: UuidGenerator,
    private readonly authGateway: AuthGateway,
  ) {}

  async execute({ email, password }: RegisterUserUseCasePayload) {
    const userWithSameEmail = await this.usersRepository.getByEmail(email);
    const userAlreadyExists = !!userWithSameEmail;
    if (userAlreadyExists) return;

    const user = User.create({
      id: this.uuidGenerator.generate(),
      email,
      password: this.passwordHasher.hash(password),
      currentDate: this.dateProvide.getNow(),
    });

    await this.usersRepository.save(user);

    await this.authGateway.login(user.id);
  }
}
