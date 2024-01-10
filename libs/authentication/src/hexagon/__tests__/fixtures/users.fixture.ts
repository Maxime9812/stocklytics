import { User } from '@app/authentication/hexagon/models/user';
import { InMemoryUsersRepository } from '@app/authentication/infra/gateways/repositories/in-memory-users.repository';
import { StubDateProvider } from '@app/authentication/hexagon/models/date-provider/stub-date.provider';
import {
  RegisterUserUseCase,
  RegisterUserUseCasePayload,
} from '@app/authentication/hexagon/usecases/register-user/register-user.usecase';
import { StubPasswordHasher } from '@app/authentication/infra/gateways/password-hashing/stub-password-hasher';
import { StubUuidGenerator } from '@app/authentication/hexagon/models/uuid-generator/stub-uuid-generator';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';
import { InMemoryCompaniesRepository } from '@app/authentication/infra/gateways/repositories/in-memory-companies.repository';
import { TransactionPerformer } from '@app/shared/transaction-performing/transaction-performer';
import { NullTransformationPerformer } from '@app/shared/transaction-performing/null-transaction-performer';

export const createUsersFixture = ({
  usersRepository = new InMemoryUsersRepository(),
  authGateway = new InMemoryAuthGateway(),
  companiesRepository = new InMemoryCompaniesRepository(),
}: Partial<{
  usersRepository: InMemoryUsersRepository;
  authGateway: InMemoryAuthGateway;
  companiesRepository: InMemoryCompaniesRepository;
}> = {}) => {
  const dateProvider = new StubDateProvider();
  const passwordHasher = new StubPasswordHasher();
  const uuidGenerator = new StubUuidGenerator();
  let transactionPerformer: TransactionPerformer =
    new NullTransformationPerformer();

  return {
    givenNowIs(now: Date) {
      dateProvider.givenNow(now);
    },
    givenTransactionPerformer(_transactionPerformer: TransactionPerformer) {
      transactionPerformer = _transactionPerformer;
    },
    givenUuid(uuid: string) {
      uuidGenerator.givenUuid(uuid);
    },
    givenHashedPassword(password: string, hashedPassword: string) {
      passwordHasher.givenHashedPassword(password, hashedPassword);
    },
    givenUsers(users: User[]) {
      usersRepository.givenUsers(users);
    },
    whenRegisterUser(payload: RegisterUserUseCasePayload) {
      return new RegisterUserUseCase(
        usersRepository,
        dateProvider,
        passwordHasher,
        uuidGenerator,
        authGateway,
        companiesRepository,
        transactionPerformer,
      ).execute(payload);
    },
    thenUsersShouldBe(users: User[]) {
      expect(usersRepository.users.map((u) => u.snapshot)).toEqual(
        users.map((u) => u.snapshot),
      );
    },
  };
};

export type UsersFixture = ReturnType<typeof createUsersFixture>;
