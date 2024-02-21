import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';

describe('Feature: Delete item image', () => {
  let fixture: ItemsFixture;

  beforeEach(() => {
    fixture = createItemsFixture();
  });

  test('Item is deleted', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id').withImage({
      id: 'image-id',
      url: 'image-url',
      itemId: 'item-id',
    });
    fixture.givenItems(initialItemBuilder.build());

    await fixture.whenDeleteItemImage({
      itemId: 'item-id',
    });

    fixture.thenImageShouldBeDeleted('image-id');

    fixture.thenItemsShouldBe(initialItemBuilder.withoutImage().build());
  });

  it('Should make the process transactional', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id').withImage({
      id: 'image-id',
      url: 'image-url',
      itemId: 'item-id',
    });
    fixture.givenItems(initialItemBuilder.build());
    fixture.givenDroppingTransactionPerformer();

    await fixture.whenDeleteItemImage({
      itemId: 'item-id',
    });

    fixture.thenItemsShouldBe(initialItemBuilder.build());
  });
});
