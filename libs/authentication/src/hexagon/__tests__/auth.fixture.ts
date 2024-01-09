import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/in-memory-auth.gateway';
import {
  LoginUseCase,
  LoginUseCasePayload,
} from '@app/authentication/hexagon/usecases/login/login.usecase';
import { InMemoryUsersRepository } from '@app/authentication/infra/gateways/repositories/in-memory-users.repository';
import { StubPasswordHasher } from '@app/authentication/infra/gateways/password-hashing/stub-password-hasher';
import { LogoutUseCase } from '@app/authentication/hexagon/usecases/logout/logout.usecase';

export const createAuthFixture = ({
  usersRepository = new InMemoryUsersRepository(),
  authGateway = new InMemoryAuthGateway(),
}: Partial<{
  usersRepository: InMemoryUsersRepository;
  authGateway: InMemoryAuthGateway;
}> = {}) => {
  const passwordHasher = new StubPasswordHasher();

  return {
    givenUserIsLoggedInAs(userId: string) {
      authGateway.givenUserId(userId);
    },
    givenPasswordCompareResult(
      params: { password: string; hash: string },
      result: boolean,
    ) {
      passwordHasher.givenCompareResult(params, result);
    },
    whenLogin(payload: LoginUseCasePayload) {
      return new LoginUseCase(
        usersRepository,
        authGateway,
        passwordHasher,
      ).execute(payload);
    },
    whenLogout() {
      return new LogoutUseCase(authGateway).execute();
    },
    thenUserIsLoggedInAs: (userId: string) => {
      expect(authGateway.userId).toEqual(userId);
    },
    thenUserIsNotLoggedIn: () => {
      expect(authGateway.userId).toEqual(undefined);
    },
  };
};

export type AuthFixture = ReturnType<typeof createAuthFixture>;
