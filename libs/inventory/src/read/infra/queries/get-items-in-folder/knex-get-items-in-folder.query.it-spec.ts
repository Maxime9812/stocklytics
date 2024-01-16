import knex, { Knex } from 'knex';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../test/docker-manager';
import { KnexGetItemsInFolderQuery } from '@app/inventory/read/infra/queries/get-items-in-folder/knex-get-items-in-folder.query';
import { FolderPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/folder.pm';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';

describe('KnexGetItemsInFolder', () => {
  let sqlConnection: Knex;
  let knexGetItemsInFolder: KnexGetItemsInFolderQuery;

  beforeAll(async () => {
    sqlConnection = knex(knexConfig.test);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
    knexGetItemsInFolder = new KnexGetItemsInFolderQuery(sqlConnection);
  });

  test('Folder does NOT exist', async () => {
    const items = await knexGetItemsInFolder.execute({
      folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
      companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
    });
    expect(items).toBeUndefined();
  });

  describe('Folder exist', () => {
    describe('Folder is hold by same company', () => {
      test('Folder is empty', async () => {
        await sqlConnection<FolderPm>('folders').insert({
          id: '6634d3ab-478a-4681-88cf-add760278f8f',
          name: 'Electronics',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          createdAt: new Date('2024-01-01'),
        });
        const items = await knexGetItemsInFolder.execute({
          folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
        });

        expect(items).toEqual([]);
      });
      test('Folder contain items', async () => {
        await sqlConnection<FolderPm>('folders').insert({
          id: '6634d3ab-478a-4681-88cf-add760278f8f',
          name: 'Electronics',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          createdAt: new Date('2024-01-01'),
        });

        await sqlConnection<ItemPm>('items').insert([
          {
            id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
            name: 'Iphone 13',
            quantity: 10,
            companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
            folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
            createdAt: new Date('2024-01-01'),
          },
          {
            id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e76',
            name: 'Macbook Pro M3',
            quantity: 2,
            companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
            folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
            createdAt: new Date('2024-01-01'),
          },
        ]);

        const items = await knexGetItemsInFolder.execute({
          folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
        });

        expect(items).toEqual([
          {
            id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
            name: 'Iphone 13',
            quantity: 10,
          },
          {
            id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e76',
            name: 'Macbook Pro M3',
            quantity: 2,
          },
        ]);
      });
    });
  });
});
