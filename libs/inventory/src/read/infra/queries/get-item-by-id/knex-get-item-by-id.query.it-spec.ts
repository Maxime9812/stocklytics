import knex, { Knex } from 'knex';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../test/docker-manager';
import { KnexGetItemByIdQuery } from '@app/inventory/read/infra/queries/get-item-by-id/knex-get-item-by-id.query';
import { GetItemByIdResponse } from '@app/inventory/read/hexagon/queries/get-item-by-id.query';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';

describe('KnexGetItemById', () => {
  let sqlConnection: Knex;
  let knexGetItemByIdQuery: KnexGetItemByIdQuery;

  beforeAll(async () => {
    sqlConnection = knex(knexConfig.test);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
    knexGetItemByIdQuery = new KnexGetItemByIdQuery(sqlConnection);
  });

  test('Item exist', async () => {
    await insertItems([
      {
        id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
        name: 'Iphone 13',
        quantity: 10,
        note: 'This is a note',
        companyId: '9706cf9d-841e-4541-9eba-a2c7c2c765e6',
        folderId: 'd0bf789c-8788-4293-b730-cd05e9c34418',
        createdAt: new Date('2024-01-01'),
      },
    ]);

    const item = await knexGetItemByIdQuery.execute(
      'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
    );
    expect(item).toEqual<GetItemByIdResponse>({
      id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
      companyId: '9706cf9d-841e-4541-9eba-a2c7c2c765e6',
      note: 'This is a note',
      folderId: 'd0bf789c-8788-4293-b730-cd05e9c34418',
      name: 'Iphone 13',
      quantity: 10,
      createdAt: new Date('2024-01-01'),
    });
  });

  const insertItems = (items: ItemPm[]) => {
    return sqlConnection<ItemPm>('items').insert(items);
  };
});
