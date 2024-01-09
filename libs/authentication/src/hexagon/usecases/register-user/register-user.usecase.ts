import { UsersRepository } from '@app/authentication/hexagon/gateways/users.repository';
import { DateProvider } from '@app/authentication/hexagon/models/date-provider/date.provider';
import { User } from '@app/authentication/hexagon/models/user';
import { PasswordHasher } from '@app/authentication/hexagon/gateways/password-hasher';
import { UuidGenerator } from '@app/authentication/hexagon/models/uuid-generator/uuid-generator';

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
  ) {}

  async execute({
    email,
    password,
  }: RegisterUserUseCasePayload): Promise<string> {
    const userWithSameEmail = await this.usersRepository.getByEmail(email);
    const userAlreadyExists = !!userWithSameEmail;
    if (userAlreadyExists) return;

    const salt = this.passwordHasher.generateSalt();
    const user = User.create({
      id: this.uuidGenerator.generate(),
      email,
      salt,
      password: this.passwordHasher.hash(password, salt),
      currentDate: this.dateProvide.getNow(),
    });

    await this.usersRepository.save(user);

    return user.id;
  }
}
