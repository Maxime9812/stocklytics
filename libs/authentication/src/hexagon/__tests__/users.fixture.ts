import { User } from '@app/authentication/hexagon/models/user';
import { InMemoryUsersRepository } from '@app/authentication/infra/gateways/repositories/in-memory-users.repository';
import { StubDateProvider } from '@app/authentication/hexagon/models/date-provider/stub-date.provider';
import {
  RegisterUserUseCase,
  RegisterUserUseCasePayload,
} from '@app/authentication/hexagon/usecases/register-user/register-user.usecase';
import { StubPasswordHasher } from '@app/authentication/infra/gateways/password-hashing/stub-password-hasher';
import { StubUuidGenerator } from '@app/authentication/hexagon/models/uuid-generator/stub-uuid-generator';

export const createUsersFixture = () => {
  const usersRepository = new InMemoryUsersRepository();
  const dateProvider = new StubDateProvider();
  const passwordHasher = new StubPasswordHasher();
  const uuidGenerator = new StubUuidGenerator();

  return {
    givenNowIs(now: Date) {
      dateProvider.givenNow(now);
    },
    givenUuid(uuid: string) {
      uuidGenerator.givenUuid(uuid);
    },
    givenSalt(salt: string) {
      passwordHasher.givenSalt(salt);
    },
    givenHashedPassword({
      password,
      hashedPassword,
      salt,
    }: {
      password: string;
      hashedPassword: string;
      salt: string;
    }) {
      passwordHasher.givenHashedPassword({
        password,
        hashedPassword,
        salt,
      });
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
