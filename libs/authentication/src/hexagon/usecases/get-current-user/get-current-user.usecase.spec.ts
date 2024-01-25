import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';
import { GetCurrentUserUseCase } from '@app/authentication/hexagon/usecases/get-current-user/get-current-user.usecase';
import { StubGetCurrentUserQuery } from '@app/authentication/infra/queries/stub-get-current-user.query';

describe('Feature: Get current user', () => {
  describe('Scenario: User is logged in', () => {
    it('Should return current user', async () => {
      const authGateway = new InMemoryAuthGateway();
      authGateway.givenAuthUser({ id: 'user-id', companyId: 'company-id' });
      const getCurrentUserQuery = new StubGetCurrentUserQuery();
      getCurrentUserQuery.givenResult('user-id', {
        id: 'user-id',
        email: 'john.doe@gmail.com',
      });
      const getCurrentUserUseCase = new GetCurrentUserUseCase(
        authGateway,
        getCurrentUserQuery,
      );
      const result = await getCurrentUserUseCase.execute();
      expect(result).toEqual({
        id: 'user-id',
        email: 'john.doe@gmail.com',
      });
    });
  });
});
