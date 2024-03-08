import knex, { Knex } from 'knex';

import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../test/docker-manager';
import { KnexGetTagsQuery } from '@app/inventory/read/infra/queries/get-tags/knex-get-tags.query';

describe('KnexGetTagsQuery', () => {
  let sqlConnection: Knex;
  let knexGetTagsQuery: KnexGetTagsQuery;

  beforeAll(async () => {
    sqlConnection = knex(knexConfig.test);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
    knexGetTagsQuery = new KnexGetTagsQuery(sqlConnection);
  });

  it('Should return tags', async () => {
    const companyId = '9e69f9c1-d0bd-4ec9-a0cc-df066d4f8ffe';
    const itemId = '9ce56af8-76f3-45ee-b94d-e41f99696109';
    await sqlConnection('tags').insert({
      id: itemId,
      name: 'Tag name',
      companyId,
      createdAt: new Date('2024-01-01'),
    });

    const tags = await knexGetTagsQuery.execute(companyId);

    expect(tags).toEqual([
      {
        id: itemId,
        name: 'Tag name',
      },
    ]);
  });

  it('Should not return tags from another company', async () => {
    const companyId = '9e69f9c1-d0bd-4ec9-a0cc-df066d4f8ffe';
    const itemId = '9ce56af8-76f3-45ee-b94d-e41f99696109';
    const anotherCompanyId = '9e69f9c1-d0bd-4ec9-a0cc-df066d4f8fff';
    await sqlConnection('tags').insert({
      id: itemId,
      name: 'Tag name',
      companyId,
      createdAt: new Date('2024-01-01'),
    });

    const tags = await knexGetTagsQuery.execute(anotherCompanyId);

    expect(tags).toEqual([]);
  });
});
