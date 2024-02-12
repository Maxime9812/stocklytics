import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';
import { DroppingTransactionPerformer } from '@app/shared/transaction-performing/dropping-transaction-performer';

describe('Feature: Unlink item barcode', () => {
  let fixture: ItemsFixture;

  beforeEach(() => {
    fixture = createItemsFixture();
  });

  test('Item barcode is unlinked', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id').withBarcode({
      type: 'ean13',
      value: 'barcode-value',
    });
    fixture.givenItems(initialItemBuilder.build());

    await fixture.whenUnlinkBarcode({
      itemId: 'item-id',
    });

    fixture.thenItemsShouldBe(initialItemBuilder.withoutBarcode().build());
  });

  test('Make transactional the process of unlinking barcode', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id').withBarcode({
      type: 'ean13',
      value: 'barcode-value',
    });
    fixture.givenItems(initialItemBuilder.build());
    fixture.givenTransactionPerformer(new DroppingTransactionPerformer());

    await fixture.whenUnlinkBarcode({
      itemId: 'item-id',
    });

    fixture.thenItemsShouldBe(initialItemBuilder.build());
  });
});
