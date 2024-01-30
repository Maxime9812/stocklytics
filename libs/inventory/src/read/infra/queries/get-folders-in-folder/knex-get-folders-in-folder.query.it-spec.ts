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
      {
        id: 'd0bf789c-8788-4293-b730-cd05e9c34418',
        name: 'Mobile',
        parentId: '6634d3ab-478a-4681-88cf-add760278f8f',
        createdAt: new Date('2024-01-01'),
        itemQuantity: 0,
      },
      {
        id: 'd0bf789c-8788-4293-b730-cd05e9c34419',
        name: 'PC',
        parentId: '6634d3ab-478a-4681-88cf-add760278f8f',
        createdAt: new Date('2024-01-01'),
        itemQuantity: 0,
      },
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
      {
        id: '6634d3ab-478a-4681-88cf-add760278f8f',
        name: 'Electronics',
        parentId: null,
        itemQuantity: 0,
        createdAt: new Date('2024-01-01'),
      },
    ]);
  });
});
