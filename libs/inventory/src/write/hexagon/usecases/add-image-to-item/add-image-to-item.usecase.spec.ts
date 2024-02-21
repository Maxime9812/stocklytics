import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';

describe('Feature: Add Image to Item', () => {
  let fixture: ItemsFixture;

  beforeEach(() => {
    fixture = createItemsFixture();
  });

  test('Image is added to item', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id');
    fixture.givenItems(initialItemBuilder.build());
    fixture.givenUploadedImage({
      imageId: 'image-id',
      imagePath: 'image-path',
      returnedUrl: 'image-url',
    });

    await fixture.whenAddImageToItem({
      itemId: 'item-id',
      imageId: 'image-id',
      imagePath: 'image-path',
    });

    fixture.thenItemsShouldBe(
      initialItemBuilder
        .withImage({
          id: 'image-id',
          itemId: 'item-id',
          url: 'image-url',
        })
        .build(),
    );
  });

  it('Should make the process of adding an image to an item transactional', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id');
    fixture.givenItems(initialItemBuilder.build());
    fixture.givenDroppingTransactionPerformer();
    fixture.givenUploadedImage({
      imageId: 'image-id',
      imagePath: 'image-path',
      returnedUrl: 'image-url',
    });

    await fixture.whenAddImageToItem({
      itemId: 'item-id',
      imageId: 'image-id',
      imagePath: 'image-path',
    });

    fixture.thenItemsShouldBe(initialItemBuilder.build());
  });
});
