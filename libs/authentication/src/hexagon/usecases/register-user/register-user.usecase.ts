import { UsersRepository } from '@app/authentication/hexagon/gateways/repositories/users.repository';
import { DateProvider } from '@app/authentication/hexagon/models/date-provider/date.provider';
import { User } from '@app/authentication/hexagon/models/user';
import { PasswordHasher } from '@app/authentication/hexagon/gateways/password-hasher';
import { UuidGenerator } from '@app/authentication/hexagon/models/uuid-generator/uuid-generator';
import { AuthGateway } from '@app/authentication';
import { CompaniesRepository } from '@app/authentication/hexagon/gateways/repositories/companies.repository';
import { Company } from '@app/authentication/hexagon/models/company';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';

export type RegisterUserUseCasePayload = {
  fullName: string;
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
    private readonly companiesRepository: CompaniesRepository,
    private readonly transactionPerformer: TransactionPerformer,
  ) {}

  async execute({ email, password, fullName }: RegisterUserUseCasePayload) {
    await this.transactionPerformer.perform(async (trx) => {
      const userWithSameEmail = await this.usersRepository.getByEmail(email);
      const userAlreadyExists = !!userWithSameEmail;
      if (userAlreadyExists) return;

      const [company, user] = Company.create({
        id: this.uuidGenerator.generate(),
        currentDate: this.dateProvide.getNow(),
        rootUser: {
          id: this.uuidGenerator.generate(),
          fullName,
          email,
          password: this.passwordHasher.hash(password),
        },
      });

      await this.usersRepository.save(user)(trx);
      await this.companiesRepository.save(company)(trx);

      await this.authGateway.login({
        id: user.id,
        companyId: user.companyId,
      });
    });
  }
}
