import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';
import { DroppingTransactionPerformer } from '@app/shared/transaction-performing/dropping-transaction-performer';

describe('Feature: Link barcode to item', () => {
  let fixture: ItemsFixture;

  beforeEach(() => {
    fixture = createItemsFixture();
  });

  test('Barcode is linked to item', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id');
    fixture.givenItems(initialItemBuilder.build());

    await fixture.whenLinkBarcodeToItem({
      itemId: 'item-id',
      barcode: {
        type: 'ean13',
        value: '1234567890102',
      },
    });

    fixture.thenItemsShouldBe(
      initialItemBuilder
        .withBarcode({
          type: 'ean13',
          value: '1234567890102',
        })
        .build(),
    );
  });

  test('Make transactional the process of linking barcode to item', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id');
    fixture.givenItems(initialItemBuilder.build());

    fixture.givenTransactionPerformer(new DroppingTransactionPerformer());

    await fixture.whenLinkBarcodeToItem({
      itemId: 'item-id',
      barcode: {
        type: 'ean13',
        value: '1234567890102',
      },
    });

    fixture.thenItemsShouldBe(initialItemBuilder.build());
  });
});
