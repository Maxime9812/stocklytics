import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';
import { DroppingTransactionPerformer } from '@app/shared/transaction-performing/dropping-transaction-performer';

describe('Feature: Delete Item', () => {
  let fixture: ItemsFixture;

  beforeEach(() => {
    fixture = createItemsFixture();
  });

  test('Item is deleted', async () => {
    fixture.givenItems(itemBuilder().withId('item-id').build());

    await fixture.whenDeleteItem({
      itemId: 'item-id',
    });

    fixture.thenItemsShouldBeEmpty();
  });

  test('Make transactional the process of deleting an item', async () => {
    const item = itemBuilder().withId('item-id').build();
    fixture.givenItems(item);

    fixture.givenTransactionPerformer(new DroppingTransactionPerformer());

    await fixture.whenDeleteItem({
      itemId: 'item-id',
    });

    fixture.thenItemsShouldBe(item);
  });
});
