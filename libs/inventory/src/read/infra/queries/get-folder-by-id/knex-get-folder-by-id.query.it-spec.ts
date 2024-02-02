import knex, { Knex } from 'knex';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../test/docker-manager';
import { KnexGetFolderByIdQuery } from '@app/inventory/read/infra/queries/get-folder-by-id/knex-get-folder-by-id.query';
import { GetFolderByIdResponse } from '@app/inventory/read/hexagon/queries/get-folder-by-id.query';

describe('KnexGetFolderByIdQuery', () => {
  let sqlConnection: Knex;
  let knexGetFolderByIdQuery: KnexGetFolderByIdQuery;

  beforeAll(async () => {
    sqlConnection = knex(knexConfig.test);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
    knexGetFolderByIdQuery = new KnexGetFolderByIdQuery(sqlConnection);
  });

  test('Folder Does NOT exist', async () => {
    const folder = await knexGetFolderByIdQuery.execute(
      '502150e0-65db-4189-941a-a679f5ec0845',
    );
    expect(folder).toBeUndefined();
  });

  test('Folder exist', async () => {
    await sqlConnection('folders').insert({
      id: '502150e0-65db-4189-941a-a679f5ec0845',
      name: 'folder-name',
      parentId: '102150e0-65db-4189-941a-a679f5ec0847',
      companyId: '302150e0-65db-4189-941a-a679f5ec0842',
      createdAt: new Date('2024-01-01'),
    });

    const folder = await knexGetFolderByIdQuery.execute(
      '502150e0-65db-4189-941a-a679f5ec0845',
    );

    expect(folder).toEqual<GetFolderByIdResponse>({
      id: '502150e0-65db-4189-941a-a679f5ec0845',
      name: 'folder-name',
      itemQuantity: 0,
      companyId: '302150e0-65db-4189-941a-a679f5ec0842',
      parentId: '102150e0-65db-4189-941a-a679f5ec0847',
      createdAt: new Date('2024-01-01'),
    });
  });
});
