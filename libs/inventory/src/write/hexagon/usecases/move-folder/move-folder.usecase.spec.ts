import {
  createFoldersFixture,
  FoldersFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/folders.fixture';
import { folderBuilder } from '@app/inventory/write/hexagon/__tests__/builders/folder.builder';

describe('Feature: Move folder', () => {
  let foldersFixture: FoldersFixture;

  beforeEach(() => {
    foldersFixture = createFoldersFixture();
  });

  test('Folder is moved', async () => {
    const initialFolderBuilder = folderBuilder()
      .withId('folder-id')
      .withParentId('parent-folder-id');

    foldersFixture.givenFolders(initialFolderBuilder.build());

    await foldersFixture.whenMoveFolder({
      folderId: 'folder-id',
      parentFolderId: 'new-parent-folder-id',
    });

    foldersFixture.thenFoldersShouldBe(
      initialFolderBuilder.withParentId('new-parent-folder-id').build(),
    );
  });

  test('Folder is moved to root', async () => {
    const initialFolderBuilder = folderBuilder()
      .withId('folder-id')
      .withParentId('parent-folder-id');

    foldersFixture.givenFolders(initialFolderBuilder.build());

    await foldersFixture.whenMoveFolder({
      folderId: 'folder-id',
    });

    foldersFixture.thenFoldersShouldBe(
      initialFolderBuilder.withParentId(undefined).build(),
    );
  });
});
