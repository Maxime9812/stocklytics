import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';

describe('Feature: Create new item', () => {
  let itemsFixture: ItemsFixture;

  beforeEach(() => {
    itemsFixture = createItemsFixture();
  });

  test('Scenario: Item is created', async () => {
    itemsFixture.givenCompanyId('company-id');
    itemsFixture.givenNowIs(new Date('2023-12-23'));

    await itemsFixture.whenCreateNewItem({
      id: 'item-id',
      name: 'Iphone 13 pro max',
      quantity: 1,
      price: 1400,
    });
    itemsFixture.thenItemsShouldBe(
      itemBuilder()
        .withId('item-id')
        .withCompanyId('company-id')
        .withName('Iphone 13 pro max')
        .createdAt(new Date('2023-12-23'))
        .withQuantity(1)
        .withPrice(1400)
        .build(),
    );
  });
});
