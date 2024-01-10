import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';
import { AuthUser } from '@app/authentication';

export const createAuthFixture = ({
  authGateway = new InMemoryAuthGateway(),
}: Partial<{
  authGateway: InMemoryAuthGateway;
}> = {}) => {
  return {
    givenAuthUser: (authUser: AuthUser) => {
      authGateway.givenAuthUser(authUser);
    },
  };
};

export type AuthFixture = ReturnType<typeof createAuthFixture>;
