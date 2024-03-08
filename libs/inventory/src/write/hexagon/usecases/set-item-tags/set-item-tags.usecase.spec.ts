import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';

describe('Feature: Set item tags', () => {
  let fixture: ItemsFixture;

  beforeEach(() => {
    fixture = createItemsFixture();
  });

  test('Tags is set', async () => {
    const initialItemBuilder = itemBuilder().withId('item-id').whitTagIds();
    fixture.givenItems(initialItemBuilder.build());

    await fixture.whenSetTags({
      itemId: 'item-id',
      tagIds: ['tag-id', 'tag-id-2'],
    });

    fixture.thenItemsShouldBe(
      initialItemBuilder.whitTagIds('tag-id', 'tag-id-2').build(),
    );
  });

  it('Should make transactional the process of setting tags', async () => {
    const initialItem = itemBuilder().withId('item-id').whitTagIds().build();
    fixture.givenItems(initialItem);
    fixture.givenDroppingTransactionPerformer();

    await fixture.whenSetTags({
      itemId: 'item-id',
      tagIds: ['tag-id', 'tag-id-2'],
    });

    fixture.thenItemsShouldBe(initialItem);
  });
});
