import {
  createFoldersFixture,
  FoldersFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/folders.fixture';
import { folderBuilder } from '@app/inventory/write/hexagon/__tests__/builders/folder.builder';

describe('Feature: Delete folder', () => {
  let fixture: FoldersFixture;

  beforeEach(() => {
    fixture = createFoldersFixture();
  });

  test('Folder is deleted', async () => {
    fixture.givenFolders(folderBuilder().withId('folder-id').build());

    await fixture.whenDeleteFolder({ folderId: 'folder-id' });

    fixture.thenFoldersShouldBeEmpty();
  });
});
