import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';
import { StubGetFoldersInFoldersQuery } from '@app/inventory/read/infra/queries/get-folders-in-folder/stub-get-folders-in-folders.query';
import { GetFoldersInFoldersUseCase } from '@app/inventory/read/hexagon/usecases/get-folders-in-folders/get-folders-in-folders.usecase';
import { GetFoldersInFolderResponse } from '@app/inventory/read/hexagon/queries/get-folders-in-folder.query';

describe('Feature: Get folders in folders', () => {
  describe('Scenario: Folder is root', () => {
    test('Folders are returned', async () => {
      const authGateway = new InMemoryAuthGateway();
      authGateway.givenAuthUser({
        id: 'user-id',
        companyId: 'company-id',
      });
      const getFoldersInFolderQuery = new StubGetFoldersInFoldersQuery();
      getFoldersInFolderQuery.givenFoldersInFolder(
        {
          companyId: 'company-id',
        },
        [
          {
            id: 'folder-id',
            name: 'folder-name',
            createdAt: new Date('2024-01-01'),
            parentId: null,
            itemQuantity: 1,
          },
          {
            id: 'folder-id-2',
            name: 'folder-name',
            createdAt: new Date('2024-01-01'),
            parentId: null,
            itemQuantity: 3,
          },
        ],
      );
      const folders = await new GetFoldersInFoldersUseCase(
        authGateway,
        getFoldersInFolderQuery,
      ).execute({});
      expect(folders).toEqual<GetFoldersInFolderResponse>([
        {
          id: 'folder-id',
          name: 'folder-name',
          createdAt: new Date('2024-01-01'),
          parentId: null,
          itemQuantity: 1,
        },
        {
          id: 'folder-id-2',
          name: 'folder-name',
          createdAt: new Date('2024-01-01'),
          parentId: null,
          itemQuantity: 3,
        },
      ]);
    });
  });

  describe('Scenario: Folder exist', () => {
    test('Folders are returned', async () => {
      const authGateway = new InMemoryAuthGateway();
      authGateway.givenAuthUser({
        id: 'user-id',
        companyId: 'company-id',
      });
      const getFoldersInFolderQuery = new StubGetFoldersInFoldersQuery();
      getFoldersInFolderQuery.givenFoldersInFolder(
        {
          companyId: 'company-id',
          folderId: 'parent-id',
        },
        [
          {
            id: 'folder-id',
            name: 'folder-name',
            createdAt: new Date('2024-01-01'),
            parentId: 'parent-id',
            itemQuantity: 1,
          },
          {
            id: 'folder-id-2',
            name: 'folder-name',
            createdAt: new Date('2024-01-01'),
            parentId: 'parent-id',
            itemQuantity: 3,
          },
        ],
      );
      const folders = await new GetFoldersInFoldersUseCase(
        authGateway,
        getFoldersInFolderQuery,
      ).execute({ folderId: 'parent-id' });
      expect(folders).toEqual<GetFoldersInFolderResponse>([
        {
          id: 'folder-id',
          name: 'folder-name',
          createdAt: new Date('2024-01-01'),
          parentId: 'parent-id',
          itemQuantity: 1,
        },
        {
          id: 'folder-id-2',
          name: 'folder-name',
          createdAt: new Date('2024-01-01'),
          parentId: 'parent-id',
          itemQuantity: 3,
        },
      ]);
    });
  });
});
