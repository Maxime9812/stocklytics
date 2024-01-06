import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';

describe('Feature: Remove item tag', () => {
  let itemsFixture: ItemsFixture;

  beforeEach(() => {
    itemsFixture = createItemsFixture();
  });

  test('Tag is removed from item', async () => {
    const initialItemBuilder = itemBuilder()
      .withId('item-id')
      .whitTagIds('tag-id');

    itemsFixture.givenItems(initialItemBuilder.build());

    await itemsFixture.whenRemoveItemTag({
      itemId: 'item-id',
      tagId: 'tag-id',
    });

    itemsFixture.thenItemsShouldBe(initialItemBuilder.whitTagIds().build());
  });
});
