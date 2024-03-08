import { GetTagsUseCase } from '@app/inventory/read/hexagon/usecases/get-tags/get-tags.usecase';
import { InMemoryAuthGateway } from '@app/authentication/infra/gateways/auth-gateways/in-memory-auth.gateway';
import { StubGetTagsQuery } from '@app/inventory/read/infra/queries/get-tags/stub-get-tags.query';

describe('Feature: Get tags', () => {
  it('Should return tags', async () => {
    const authGateway = new InMemoryAuthGateway();
    authGateway.givenAuthUser({ id: 'user-id', companyId: 'company-id' });
    const getTagsQuery = new StubGetTagsQuery();
    getTagsQuery.givenTags('company-id', [
      {
        id: 'tag-id',
        name: 'Tag name',
      },
    ]);

    const tags = await new GetTagsUseCase(authGateway, getTagsQuery).execute();

    expect(tags).toEqual([
      {
        id: 'tag-id',
        name: 'Tag name',
      },
    ]);
  });
});
