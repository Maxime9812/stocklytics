import { tagBuilder } from '@app/inventory/write/hexagon/__tests__/tag.builder';
import {
  createTagsFixture,
  TagsFixture,
} from '@app/inventory/write/hexagon/__tests__/tags.fixture';

describe('Feature: Create new tag', () => {
  let tagsFixture: TagsFixture;

  beforeEach(() => {
    tagsFixture = createTagsFixture();
  });

  test('Tag is created', async () => {
    tagsFixture.givenCompanyId('company-id');
    tagsFixture.givenNowIs(new Date('2024-01-01'));

    await tagsFixture.whenCreateNewTag({
      id: '123456',
      name: 'Phone',
    });

    tagsFixture.thenTagsShouldBe(
      tagBuilder()
        .withId('123456')
        .withName('Phone')
        .whitCompanyId('company-id')
        .withCreatedAt(new Date('2024-01-01'))
        .build(),
    );
  });

  describe('Scenario: A Tag exist with same name', () => {
    test('Tag is not created', async () => {
      const initialTag = tagBuilder().withName('Phone').build();
      tagsFixture.givenTags(initialTag);
      tagsFixture.givenCompanyId('company-id');
      tagsFixture.givenNowIs(new Date('2024-01-01'));
      await tagsFixture.whenCreateNewTag({
        id: '123456',
        name: 'Phone',
      });

      tagsFixture.thenTagsShouldBe(initialTag);
    });
  });
});
