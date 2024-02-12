import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';
import { DroppingTransactionPerformer } from '@app/shared/transaction-performing/dropping-transaction-performer';

describe('Feature: Edit Item note', () => {
  let fixture: ItemsFixture;

  beforeEach(() => {
    fixture = createItemsFixture();
  });

  test('Item note is edited', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id').withNote('');
    fixture.givenItems(initialItemBuilder.build());

    await fixture.whenEditNote({
      itemId: 'item-id',
      note: 'New note',
    });

    fixture.thenItemsShouldBe(initialItemBuilder.withNote('New note').build());
  });

  test('Make transactional edition of item note', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id').withNote('');
    fixture.givenItems(initialItemBuilder.build());

    fixture.givenTransactionPerformer(new DroppingTransactionPerformer());

    await fixture.whenEditNote({
      itemId: 'item-id',
      note: 'New note',
    });

    fixture.thenItemsShouldBe(initialItemBuilder.build());
  });
});
