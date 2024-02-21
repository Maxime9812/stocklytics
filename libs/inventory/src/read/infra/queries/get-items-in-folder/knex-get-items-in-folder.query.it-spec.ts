import knex, { Knex } from 'knex';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../test/docker-manager';
import { KnexGetItemsInFolderQuery } from '@app/inventory/read/infra/queries/get-items-in-folder/knex-get-items-in-folder.query';
import { FolderPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/folder.pm';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';
import { GetItemsInFolderResponse } from '@app/inventory/read/hexagon/queries/get-items-in-folder.query';
import { ItemImagePm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item-image.pm';

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

  describe('Folder is not hold by same company', () => {
    test('Folder contain items', async () => {
      await sqlConnection<FolderPm>('folders').insert({
        id: '6634d3ab-478a-4681-88cf-add760278f8f',
        name: 'Electronics',
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
        createdAt: new Date('2024-01-01'),
      });

      await insertItems([
        {
          id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
          name: 'Iphone 13',
          quantity: 10,
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf2',
          folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
          note: '',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e76',
          name: 'Macbook Pro M3',
          quantity: 2,
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf2',
          folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
          note: '',
          createdAt: new Date('2024-01-01'),
        },
      ]);

      const items = await knexGetItemsInFolder.execute({
        folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
      });

      expect(items).toEqual([]);
    });
  });

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

      await insertItems([
        {
          id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
          name: 'Iphone 13',
          quantity: 10,
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
          note: '',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e76',
          name: 'Macbook Pro M3',
          quantity: 2,
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
          barcodeType: 'ean13',
          barcodeValue: '1234567890',
          note: 'This is a note',
          createdAt: new Date('2024-01-01'),
        },
      ]);

      const items = await knexGetItemsInFolder.execute({
        folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
      });

      expect(items).toEqual<GetItemsInFolderResponse>([
        {
          id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
          name: 'Iphone 13',
          note: '',
          folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
          createdAt: new Date('2024-01-01'),
          tags: [],
          quantity: 10,
        },
        {
          id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e76',
          name: 'Macbook Pro M3',
          note: 'This is a note',
          createdAt: new Date('2024-01-01'),
          barcode: {
            type: 'ean13',
            value: '1234567890',
          },
          tags: [],
          folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
          quantity: 2,
        },
      ]);
    });

    test('Items have image', async () => {
      await sqlConnection<FolderPm>('folders').insert({
        id: '6634d3ab-478a-4681-88cf-add760278f8f',
        name: 'Electronics',
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
        createdAt: new Date('2024-01-01'),
      });

      await insertItems([
        {
          id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
          name: 'Iphone 13',
          quantity: 10,
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
          note: '',
          createdAt: new Date('2024-01-01'),
        },
      ]);

      await insertImage({
        id: 'a2dea07f-6a2c-48a1-9c20-5d4905598e73',
        itemId: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
        url: 'http://localhost:3000/image.jpg',
      });

      const items = await knexGetItemsInFolder.execute({
        folderId: '6634d3ab-478a-4681-88cf-add760278f8f',
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
      });

      expect(items).toEqual<GetItemsInFolderResponse>([
        expect.objectContaining({
          imageUrl: 'http://localhost:3000/image.jpg',
        }),
      ]);
    });

    test('Folder is root', async () => {
      await sqlConnection<FolderPm>('folders').insert({
        id: '6634d3ab-478a-4681-88cf-add760278f8f',
        name: 'Electronics',
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
        createdAt: new Date('2024-01-01'),
      });

      await insertItems([
        {
          id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
          name: 'Iphone 13',
          quantity: 10,
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          folderId: null,
          note: '',
          createdAt: new Date('2024-01-01'),
        },
        {
          id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e76',
          name: 'Macbook Pro M3',
          quantity: 2,
          note: '',
          companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
          folderId: null,
          createdAt: new Date('2024-01-01'),
        },
      ]);

      const items = await knexGetItemsInFolder.execute({
        companyId: '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1',
      });

      expect(items).toEqual<GetItemsInFolderResponse>([
        {
          id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
          name: 'Iphone 13',
          folderId: null,
          note: '',
          createdAt: new Date('2024-01-01'),
          tags: [],
          quantity: 10,
        },
        {
          id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e76',
          name: 'Macbook Pro M3',
          createdAt: new Date('2024-01-01'),
          folderId: null,
          note: '',
          tags: [],
          quantity: 2,
        },
      ]);
    });
  });

  const insertItems = async (items: ItemPm[]) => {
    await sqlConnection('items').insert(items);
  };

  const insertImage = (image: ItemImagePm) => {
    return sqlConnection<ItemPm>('item_images').insert(image);
  };
});
