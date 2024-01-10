import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';
import {
  LoginUseCase,
  LoginUseCasePayload,
} from '@app/authentication/hexagon/usecases/login/login.usecase';
import { InMemoryUsersRepository } from '@app/authentication/infra/gateways/repositories/in-memory-users.repository';
import { StubPasswordHasher } from '@app/authentication/infra/gateways/password-hashing/stub-password-hasher';
import { LogoutUseCase } from '@app/authentication/hexagon/usecases/logout/logout.usecase';
import { AuthUser } from '@app/authentication';

export const createAuthFixture = ({
  usersRepository = new InMemoryUsersRepository(),
  authGateway = new InMemoryAuthGateway(),
}: Partial<{
  usersRepository: InMemoryUsersRepository;
  authGateway: InMemoryAuthGateway;
}> = {}) => {
  const passwordHasher = new StubPasswordHasher();

  return {
    givenUserIsLoggedInAs(authUser: AuthUser) {
      authGateway.givenAuthUser(authUser);
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
    thenUserIsLoggedInAs: (authUser: AuthUser) => {
      expect(authGateway.authUser).toEqual(authUser);
    },
    thenUserIsNotLoggedIn: () => {
      expect(authGateway.authUser).toBeUndefined();
    },
  };
};

export type AuthFixture = ReturnType<typeof createAuthFixture>;
