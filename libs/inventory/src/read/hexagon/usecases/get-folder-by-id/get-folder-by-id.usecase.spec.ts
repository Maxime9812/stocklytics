import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';
import { GetFolderByIdUseCase } from '@app/inventory/read/hexagon/usecases/get-folder-by-id/get-folder-by-id.usecase';
import { StubGetFolderById } from '@app/inventory/read/infra/queries/get-folder-by-id/stub-get-folder-by-id';
import { GetFolderByIdResponse } from '@app/inventory/read/hexagon/queries/get-folder-by-id.query';

describe('Feature: Get folder by id', () => {
  test('Nothing is return when folder does NOT exist', async () => {
    const authGateway = new InMemoryAuthGateway();
    authGateway.givenAuthUser({
      id: 'user-id',
      companyId: 'company-id',
    });
    const getFolderByIdQuery = new StubGetFolderById();
    const item = await new GetFolderByIdUseCase(
      getFolderByIdQuery,
      authGateway,
    ).execute('502150e0-65db-4189-941a-a679f5ec0845');
    expect(item).toBeUndefined();
  });

  describe('Scenario: Folder exist', () => {
    test('Folder is returned', async () => {
      const authGateway = new InMemoryAuthGateway();
      authGateway.givenAuthUser({
        id: 'user-id',
        companyId: 'company-id',
      });
      const getFolderByIdQuery = new StubGetFolderById();
      getFolderByIdQuery.givenFolder({
        id: '502150e0-65db-4189-941a-a679f5ec0845',
        name: 'folder-name',
        itemQuantity: 0,
        companyId: 'company-id',
        createdAt: new Date('2024-01-01'),
      });
      const folder = await new GetFolderByIdUseCase(
        getFolderByIdQuery,
        authGateway,
      ).execute('502150e0-65db-4189-941a-a679f5ec0845');
      expect(folder).toEqual<GetFolderByIdResponse>({
        id: '502150e0-65db-4189-941a-a679f5ec0845',
        name: 'folder-name',
        itemQuantity: 0,
        companyId: 'company-id',
        createdAt: new Date('2024-01-01'),
      });
    });
    test('Nothing is return when folder is not hold by user company', async () => {
      const authGateway = new InMemoryAuthGateway();
      authGateway.givenAuthUser({
        id: 'user-id',
        companyId: 'company-id',
      });
      const getFolderByIdQuery = new StubGetFolderById();
      getFolderByIdQuery.givenFolder({
        id: '502150e0-65db-4189-941a-a679f5ec0845',
        name: 'folder-name',
        companyId: 'another-company-id',
        itemQuantity: 0,
        createdAt: new Date('2024-01-01'),
      });
      const folder = await new GetFolderByIdUseCase(
        getFolderByIdQuery,
        authGateway,
      ).execute('502150e0-65db-4189-941a-a679f5ec0845');
      expect(folder).toBeUndefined();
    });
  });
});
