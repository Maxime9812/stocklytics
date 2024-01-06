import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/in-memory-auth.gateway';

export const createAuthFixture = ({
  authGateway = new InMemoryAuthGateway(),
}: Partial<{
  authGateway: InMemoryAuthGateway;
}> = {}) => {
  return {
    givenCompanyId: (companyId: string) => {
      authGateway.givenCompanyId(companyId);
    },
  };
};

export type AuthFixture = ReturnType<typeof createAuthFixture>;
