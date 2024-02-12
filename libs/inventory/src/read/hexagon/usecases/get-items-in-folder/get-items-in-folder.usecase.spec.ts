import { GetItemsInFolderUseCase } from '@app/inventory/read/hexagon/usecases/get-items-in-folder/get-items-in-folder.usecase';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';
import { StubGetItemsInFolderQuery } from '@app/inventory/read/infra/queries/get-items-in-folder/stub-get-items-in-folder.query';
import { GetItemsInFolderResponse } from '@app/inventory/read/hexagon/queries/get-items-in-folder.query';

describe('Feature: Get items in folder', () => {
  describe('Scenario: Folder exist', () => {
    test('Items are returned', async () => {
      const authGateway = new InMemoryAuthGateway();
      authGateway.givenAuthUser({
        id: 'user-id',
        companyId: 'company-id',
      });
      const getItemsInFolderQuery = new StubGetItemsInFolderQuery();
      getItemsInFolderQuery.givenItems(
        {
          folderId: 'e0a5e0a5-65db-4189-941a-a679f5ec0845',
          companyId: 'company-id',
        },
        [
          {
            id: '502150e0-65db-4189-941a-a679f5ec0845',
            name: 'item-name',
            note: 'This is a note',
            tags: [],
            createdAt: new Date('2024-01-01'),
            folderId: 'e0a5e0a5-65db-4189-941a-a679f5ec0845',
            quantity: 10,
          },
        ],
      );
      const items = await new GetItemsInFolderUseCase(
        authGateway,
        getItemsInFolderQuery,
      ).execute({
        folderId: 'e0a5e0a5-65db-4189-941a-a679f5ec0845',
      });
      expect(items).toEqual<GetItemsInFolderResponse>([
        {
          id: '502150e0-65db-4189-941a-a679f5ec0845',
          name: 'item-name',
          note: 'This is a note',
          tags: [],
          createdAt: new Date('2024-01-01'),
          folderId: 'e0a5e0a5-65db-4189-941a-a679f5ec0845',
          quantity: 10,
        },
      ]);
    });
    test('Folder is root', async () => {
      const authGateway = new InMemoryAuthGateway();
      authGateway.givenAuthUser({
        id: 'user-id',
        companyId: 'company-id',
      });
      const getItemsInFolderQuery = new StubGetItemsInFolderQuery();
      getItemsInFolderQuery.givenItems(
        {
          companyId: 'company-id',
        },
        [
          {
            id: '502150e0-65db-4189-941a-a679f5ec0845',
            name: 'item-name',
            note: 'This is a note',
            tags: [],
            createdAt: new Date('2024-01-01'),
            folderId: 'e0a5e0a5-65db-4189-941a-a679f5ec0845',
            quantity: 10,
          },
        ],
      );
      const items = await new GetItemsInFolderUseCase(
        authGateway,
        getItemsInFolderQuery,
      ).execute({});
      expect(items).toEqual<GetItemsInFolderResponse>([
        {
          id: '502150e0-65db-4189-941a-a679f5ec0845',
          name: 'item-name',
          note: 'This is a note',
          tags: [],
          createdAt: new Date('2024-01-01'),
          folderId: 'e0a5e0a5-65db-4189-941a-a679f5ec0845',
          quantity: 10,
        },
      ]);
    });
  });
});
