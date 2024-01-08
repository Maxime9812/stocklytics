import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';
import {
  createFoldersFixture,
  FoldersFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/folders.fixture';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';
import { folderBuilder } from '@app/inventory/write/hexagon/__tests__/builders/folder.builder';
import { InMemoryFoldersRepository } from '@app/inventory/write/infra/gateways/repositories/in-memory-folders.repository';
import { DroppingTransactionPerformer } from '@app/inventory/write/infra/gateways/transaction-performing/dropping-transaction-performer';

describe('Feature: Move item into folder', () => {
  let itemsFixture: ItemsFixture;
  let foldersFixture: FoldersFixture;

  beforeEach(() => {
    const foldersRepository = new InMemoryFoldersRepository();
    itemsFixture = createItemsFixture({ foldersRepository });
    foldersFixture = createFoldersFixture({ foldersRepository });
  });

  test('Item is moved', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id');
    itemsFixture.givenItems(initialItemBuilder.build());
    foldersFixture.givenFolders(folderBuilder().withId('folder-id').build());

    await itemsFixture.whenMoveItemToFolder({
      itemId: 'item-id',
      folderId: 'folder-id',
    });

    itemsFixture.thenItemsShouldBe(
      initialItemBuilder.withFolderId('folder-id').build(),
    );
  });

  test('Item is moved to root', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id');
    itemsFixture.givenItems(initialItemBuilder.build());
    foldersFixture.givenFolders(folderBuilder().withId('folder-id').build());

    await itemsFixture.whenMoveItemToFolder({
      itemId: 'item-id',
    });

    itemsFixture.thenItemsShouldBe(
      initialItemBuilder.withFolderId(undefined).build(),
    );
  });

  it('should make transactional the process of moving item into folder', async () => {
    const initialItem = itemBuilder()
      .withId('item-id')
      .withFolderId('folder-id')
      .build();
    itemsFixture.givenItems(initialItem);
    foldersFixture.givenFolders(
      folderBuilder().withId('new-folder-id').build(),
    );
    itemsFixture.givenTransactionPerformer(new DroppingTransactionPerformer());

    await itemsFixture.whenMoveItemToFolder({
      itemId: 'item-id',
      folderId: 'new-folder-id',
    });

    itemsFixture.thenItemsShouldBe(initialItem);
  });
});
