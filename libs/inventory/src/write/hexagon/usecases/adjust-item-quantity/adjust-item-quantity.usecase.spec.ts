import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';
import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';

describe('Feature: Adjust item quantity', () => {
  let fixture: ItemsFixture;

  beforeEach(() => {
    fixture = createItemsFixture();
  });

  test.each([
    {
      quantity: 5,
      expectedQuantity: 15,
    },
    {
      quantity: -5,
      expectedQuantity: 5,
    },
  ])('Item quantity is adjusted', async ({ quantity, expectedQuantity }) => {
    const initialItemBuilder = itemBuilder().withId('item-id').withQuantity(10);
    fixture.givenItems(initialItemBuilder.build());

    await fixture.whenAdjustItemQuantity({
      itemId: 'item-id',
      quantity,
    });

    fixture.thenItemsShouldBe(
      initialItemBuilder.withQuantity(expectedQuantity).build(),
    );
  });

  test('Item quantity cannot be negative', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id').withQuantity(4);
    fixture.givenItems(initialItemBuilder.build());

    await fixture.whenAdjustItemQuantity({
      itemId: 'item-id',
      quantity: -5,
    });

    fixture.thenErrorShouldBe({ type: 'ItemQuantityCannotBeNegativeError' });
  });

  it('Should make the process of adjusting the item quantity transactional', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id').withQuantity(10);
    fixture.givenItems(initialItemBuilder.build());
    fixture.givenDroppingTransactionPerformer();

    await fixture.whenAdjustItemQuantity({
      itemId: 'item-id',
      quantity: 5,
    });

    fixture.thenItemsShouldBe(initialItemBuilder.build());
  });
});
