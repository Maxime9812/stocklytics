import {
  createFoldersFixture,
  FoldersFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/folders.fixture';
import { folderBuilder } from '@app/inventory/write/hexagon/__tests__/builders/folder.builder';
import {
  AuthFixture,
  createAuthFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/auth.fixture';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';

describe('Feature: Create new folder', () => {
  let foldersFixture: FoldersFixture;
  let authFixture: AuthFixture;

  beforeEach(() => {
    const authGateway = new InMemoryAuthGateway();
    foldersFixture = createFoldersFixture({ authGateway });
    authFixture = createAuthFixture({ authGateway });
  });

  test('Folder is created', async () => {
    foldersFixture.givenNowIs(new Date('2024-01-01'));
    authFixture.givenCompanyId('company-id');
    await foldersFixture.whenCreateNewFolder({
      id: 'folder-id',
      name: 'Electronics',
    });

    foldersFixture.thenFoldersShouldBe(
      folderBuilder()
        .withId('folder-id')
        .withName('Electronics')
        .withCompanyId('company-id')
        .createdAt(new Date('2024-01-01'))
        .build(),
    );
  });

  test('Folder is created and attached to parent', async () => {
    foldersFixture.givenNowIs(new Date('2024-01-01'));
    authFixture.givenCompanyId('company-id');
    await foldersFixture.whenCreateNewFolder({
      id: 'folder-id',
      name: 'Electronics',
      parentId: 'parent-folder-id',
    });

    foldersFixture.thenFoldersShouldBe(
      folderBuilder()
        .withId('folder-id')
        .withName('Electronics')
        .withCompanyId('company-id')
        .createdAt(new Date('2024-01-01'))
        .withParentId('parent-folder-id')
        .build(),
    );
  });

  describe('Scenario: Folder with same name and in same parent already exists', () => {
    test('Folder is not created', async () => {
      const alreadyCreatedFolderBuilder = folderBuilder()
        .withId('folder-id')
        .withName('Electronics')
        .withParentId('parent-folder-id')
        .createdAt(new Date('2024-01-01'))
        .withCompanyId('company-id');

      foldersFixture.givenFolders(alreadyCreatedFolderBuilder.build());
      foldersFixture.givenNowIs(new Date('2024-01-01'));
      authFixture.givenCompanyId('company-id');
      await foldersFixture.whenCreateNewFolder({
        id: 'folder-id-2',
        name: 'Electronics',
        parentId: 'parent-folder-id',
      });
      foldersFixture.thenFoldersShouldBe(alreadyCreatedFolderBuilder.build());
    });
  });
});
