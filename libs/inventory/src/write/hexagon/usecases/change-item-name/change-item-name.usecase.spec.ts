import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';

describe('Feature: Change Item Name', () => {
  let fixture: ItemsFixture;

  beforeEach(() => {
    fixture = createItemsFixture();
  });

  test('Can change item name', async () => {
    const initialItemBuilder = itemBuilder()
      .withId('item-id')
      .withName('initial name');

    fixture.givenItems(initialItemBuilder.build());

    await fixture.whenChangeItemName({
      itemId: 'item-id',
      name: 'new name',
    });

    fixture.thenItemsShouldBe(initialItemBuilder.withName('new name').build());
  });

  it('Should make the process of changing name transactional', async () => {
    const initialItem = itemBuilder()
      .withId('item-id')
      .withName('initial name')
      .build();

    fixture.givenItems(initialItem);
    fixture.givenDroppingTransactionPerformer();

    await fixture.whenChangeItemName({
      itemId: 'item-id',
      name: 'new name',
    });

    fixture.thenItemsShouldBe(initialItem);
  });
});
