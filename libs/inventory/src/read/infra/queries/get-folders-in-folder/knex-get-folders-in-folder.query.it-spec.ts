import knex, { Knex } from 'knex';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../test/docker-manager';
import { KnexGetFoldersInFolderQuery } from '@app/inventory/read/infra/queries/get-folders-in-folder/knex-get-folders-in-folder.query';
import { GetFoldersInFolderResponse } from '@app/inventory/read/hexagon/queries/get-folders-in-folder.query';

describe('KnexGetFoldersInFolder', () => {
  let sqlConnection: Knex;
  let knexGetFoldersInFolderQuery: KnexGetFoldersInFolderQuery;

  beforeAll(async () => {
    sqlConnection = knex(knexConfig.test);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
    knexGetFoldersInFolderQuery = new KnexGetFoldersInFolderQuery(
      sqlConnection,
    );
  });

  test('Folder exist', async () => {
    await sqlConnection('folders').insert({
      id: '6634d3ab-478a-4681-88cf-add760278f8f',
      name: 'Electronics',
      companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
      createdAt: new Date('2024-01-01'),
    });

    const folders = await knexGetFoldersInFolderQuery.execute({
      folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
      companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
    });
    expect(folders).toEqual([]);
  });

  test('Folders is in folder', async () => {
    await sqlConnection('folders').insert([
      {
        id: '6634d3ab-478a-4681-88cf-add760278f8f',
        name: 'Electronics',
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'd0bf789c-8788-4293-b730-cd05e9c34418',
        name: 'Mobile',
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
        parentId: '6634d3ab-478a-4681-88cf-add760278f8f',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'd0bf789c-8788-4293-b730-cd05e9c34419',
        name: 'PC',
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
        parentId: '6634d3ab-478a-4681-88cf-add760278f8f',
        createdAt: new Date('2024-01-01'),
      },
    ]);

    const folders = await knexGetFoldersInFolderQuery.execute({
      folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
      companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
    });

    expect(folders).toEqual<GetFoldersInFolderResponse>([
      expect.objectContaining({
        id: 'd0bf789c-8788-4293-b730-cd05e9c34418',
        name: 'Mobile',
        parentId: '6634d3ab-478a-4681-88cf-add760278f8f',
        createdAt: new Date('2024-01-01'),
      }),
      expect.objectContaining({
        id: 'd0bf789c-8788-4293-b730-cd05e9c34419',
        name: 'PC',
        parentId: '6634d3ab-478a-4681-88cf-add760278f8f',
        createdAt: new Date('2024-01-01'),
      }),
    ]);
  });

  test('Folders is root', async () => {
    await sqlConnection('folders').insert([
      {
        id: '6634d3ab-478a-4681-88cf-add760278f8f',
        name: 'Electronics',
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
        createdAt: new Date('2024-01-01'),
      },
      {
        id: 'd0bf789c-8788-4293-b730-cd05e9c34418',
        name: 'Mobile',
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
        parentId: '6634d3ab-478a-4681-88cf-add760278f8f',
        createdAt: new Date('2024-01-01'),
      },
    ]);

    const folders = await knexGetFoldersInFolderQuery.execute({
      companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
    });

    expect(folders).toEqual<GetFoldersInFolderResponse>([
      expect.objectContaining({
        id: '6634d3ab-478a-4681-88cf-add760278f8f',
        name: 'Electronics',
        parentId: null,
        createdAt: new Date('2024-01-01'),
      }),
    ]);
  });

  describe('item quantity', () => {
    it('Should return sum of items quantity in folder', async () => {
      await sqlConnection('folders').insert([
        {
          id: 'd0bf789c-8788-4293-b730-cd05e9c34418',
          name: 'Electronics',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          createdAt: new Date('2024-01-01'),
        },
      ]);
      await sqlConnection('items').insert([
        {
          id: '7634d3ab-478a-4681-88cf-add760278f8f',
          name: 'item-name-1',
          quantity: 1,
          note: 'item-note',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          folderId: 'd0bf789c-8788-4293-b730-cd05e9c34418',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: '8634d3ab-478a-4681-88cf-add760278f8f',
          name: 'item-name-2',
          quantity: 2,
          note: 'item-note',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          folderId: 'd0bf789c-8788-4293-b730-cd05e9c34418',
          createdAt: new Date('2024-01-01'),
        },
      ]);

      const folders = await knexGetFoldersInFolderQuery.execute({
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
      });

      expect(folders).toEqual<GetFoldersInFolderResponse>([
        expect.objectContaining({ itemQuantity: 3 }),
      ]);
    });
    it('Should return sum of items quantity of all folder inside of it', async () => {
      await sqlConnection('folders').insert([
        {
          id: 'd0bf789c-8788-4293-b730-cd05e9c34418',
          name: 'Electronics',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: '38f9f3ee-fba0-4a48-86d9-ff03b01a5745',
          name: 'Mobile',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          parentId: 'd0bf789c-8788-4293-b730-cd05e9c34418',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: '9cdac7f4-92c3-4acb-af5c-a81c1aa4b6ad',
          name: 'Apple',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          parentId: '38f9f3ee-fba0-4a48-86d9-ff03b01a5745',
          createdAt: new Date('2024-01-01'),
        },
      ]);
      await sqlConnection('items').insert([
        {
          id: '7634d3ab-478a-4681-88cf-add760278f8f',
          name: 'item-name-1',
          quantity: 6,
          note: 'item-note',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          folderId: '38f9f3ee-fba0-4a48-86d9-ff03b01a5745',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: '8634d3ab-478a-4681-88cf-add760278f8f',
          name: 'item-name-2',
          quantity: 4,
          note: 'item-note',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          folderId: '9cdac7f4-92c3-4acb-af5c-a81c1aa4b6ad',
          createdAt: new Date('2024-01-01'),
        },
      ]);

      const folders = await knexGetFoldersInFolderQuery.execute({
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
      });

      expect(folders).toEqual<GetFoldersInFolderResponse>([
        expect.objectContaining({ itemQuantity: 10 }),
      ]);
    });
    it('Should not calculate folders outside of it', async () => {
      await sqlConnection('folders').insert([
        {
          id: 'd0bf789c-8788-4293-b730-cd05e9c34418',
          name: 'Electronics',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: '38f9f3ee-fba0-4a48-86d9-ff03b01a5745',
          name: 'Mobile',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          parentId: 'd0bf789c-8788-4293-b730-cd05e9c34418',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: '9cdac7f4-92c3-4acb-af5c-a81c1aa4b6ad',
          name: 'Apple',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          createdAt: new Date('2024-01-01'),
        },
      ]);
      await sqlConnection('items').insert([
        {
          id: '7634d3ab-478a-4681-88cf-add760278f8f',
          name: 'item-name-1',
          quantity: 6,
          note: 'item-note',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          folderId: '38f9f3ee-fba0-4a48-86d9-ff03b01a5745',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: '8634d3ab-478a-4681-88cf-add760278f8f',
          name: 'item-name-2',
          quantity: 4,
          note: 'item-note',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          folderId: '9cdac7f4-92c3-4acb-af5c-a81c1aa4b6ad',
          createdAt: new Date('2024-01-01'),
        },
      ]);

      const folders = await knexGetFoldersInFolderQuery.execute({
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
      });

      expect(folders).toEqual<GetFoldersInFolderResponse>([
        expect.objectContaining({ itemQuantity: 6 }),
        expect.objectContaining({ itemQuantity: 4 }),
      ]);
    });
  });
});
