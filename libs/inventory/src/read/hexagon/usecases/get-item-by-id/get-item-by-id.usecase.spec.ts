import { GetItemByIdUseCase } from '@app/inventory/read/hexagon/usecases/get-item-by-id/get-item-by-id.usecase';
import { StubGetItemByIdQuery } from '@app/inventory/read/infra/queries/get-item-by-id/stub-get-item-by-id.query';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';

describe('Feature: Get item by id', () => {
  test('Nothing is return when item does NOT exist', async () => {
    const authGateway = new InMemoryAuthGateway();
    authGateway.givenAuthUser({
      id: 'user-id',
      companyId: 'company-id',
    });
    const getItemByIdQuery = new StubGetItemByIdQuery();
    const item = await new GetItemByIdUseCase(
      getItemByIdQuery,
      authGateway,
    ).execute({
      id: '502150e0-65db-4189-941a-a679f5ec0845',
    });
    expect(item).toBeUndefined();
  });
  describe('Scenario: Item exist', () => {
    test('Item is returned', async () => {
      const authGateway = new InMemoryAuthGateway();
      authGateway.givenAuthUser({
        id: 'user-id',
        companyId: 'company-id',
      });
      const getItemByIdQuery = new StubGetItemByIdQuery();
      getItemByIdQuery.givenItem('502150e0-65db-4189-941a-a679f5ec0845', {
        id: '502150e0-65db-4189-941a-a679f5ec0845',
        name: 'item-name',
        quantity: 10,
        companyId: 'company-id',
        createdAt: new Date('2024-01-01'),
      });
      const item = await new GetItemByIdUseCase(
        getItemByIdQuery,
        authGateway,
      ).execute({
        id: '502150e0-65db-4189-941a-a679f5ec0845',
      });
      expect(item).toEqual({
        id: '502150e0-65db-4189-941a-a679f5ec0845',
        name: 'item-name',
        quantity: 10,
        folderId: undefined,
        companyId: 'company-id',
        createdAt: new Date('2024-01-01'),
      });
    });
    test('Nothing is return when item is not hold by user company', async () => {
      const authGateway = new InMemoryAuthGateway();
      authGateway.givenAuthUser({
        id: 'user-id',
        companyId: 'company-id',
      });
      const getItemByIdQuery = new StubGetItemByIdQuery();
      getItemByIdQuery.givenItem('502150e0-65db-4189-941a-a679f5ec0845', {
        id: '502150e0-65db-4189-941a-a679f5ec0845',
        name: 'item-name',
        quantity: 10,
        folderId: undefined,
        companyId: 'company-id-2',
        createdAt: new Date('2024-01-01'),
      });

      const item = await new GetItemByIdUseCase(
        getItemByIdQuery,
        authGateway,
      ).execute({
        id: '502150e0-65db-4189-941a-a679f5ec0845',
      });
      expect(item).toBeUndefined();
    });
  });
});
