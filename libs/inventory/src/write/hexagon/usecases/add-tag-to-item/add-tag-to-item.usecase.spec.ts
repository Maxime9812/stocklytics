import {
  createTagsFixture,
  TagsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/tags.fixture';
import {
  createItemsFixture,
  ItemsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/items.fixture';
import { InMemoryTagsRepository } from '@app/inventory/write/infra/gateways/repositories/in-memory-tags.repository';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';
import { tagBuilder } from '@app/inventory/write/hexagon/__tests__/builders/tag.builder';

describe('Feature: Add tag to item', () => {
  let tagsFixture: TagsFixture;
  let itemsFixture: ItemsFixture;

  beforeEach(() => {
    const tagsRepository = new InMemoryTagsRepository();
    tagsFixture = createTagsFixture({ tagsRepository });
    itemsFixture = createItemsFixture({ tagsRepository });
  });

  test('Tag is added to item', async () => {
    tagsFixture.givenTags(tagBuilder().withId('tag-id').build());
    const initialItemBuilder = itemBuilder().withId('item-id');
    itemsFixture.givenItems(initialItemBuilder.build());

    await itemsFixture.whenAddTagToItem({
      itemId: 'item-id',
      tagId: 'tag-id',
    });

    itemsFixture.thenItemsShouldBe(
      initialItemBuilder.whitTagIds('tag-id').build(),
    );
  });

  describe('Scenario: Item already have the tag', () => {
    test('Tag is not added to item', async () => {
      tagsFixture.givenTags(tagBuilder().withId('tag-id').build());
      const initialItemBuilder = itemBuilder()
        .withId('item-id')
        .whitTagIds('tag-id');
      itemsFixture.givenItems(initialItemBuilder.build());

      await itemsFixture.whenAddTagToItem({
        itemId: 'item-id',
        tagId: 'tag-id',
      });

      itemsFixture.thenItemsShouldBe(initialItemBuilder.build());
    });
  });
});
