import { tagBuilder } from '@app/inventory/write/hexagon/__tests__/builders/tag.builder';
import {
  createTagsFixture,
  TagsFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/tags.fixture';
import {
  AuthFixture,
  createAuthFixture,
} from '@app/inventory/write/hexagon/__tests__/fixtures/auth.fixture';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';

describe('Feature: Create new tag', () => {
  let tagsFixture: TagsFixture;
  let authFixture: AuthFixture;

  beforeEach(() => {
    const authGateway = new InMemoryAuthGateway();
    tagsFixture = createTagsFixture({ authGateway });
    authFixture = createAuthFixture({ authGateway });
  });

  test('Tag is created', async () => {
    authFixture.givenAuthUser({
      id: 'user-id',
      companyId: 'company-id',
    });
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
      authFixture.givenAuthUser({
        id: 'user-id',
        companyId: 'company-id',
      });
      tagsFixture.givenNowIs(new Date('2024-01-01'));
      await tagsFixture.whenCreateNewTag({
        id: '123456',
        name: 'Phone',
      });

      tagsFixture.thenTagsShouldBe(initialTag);
    });
  });
});
