import knex, { Knex } from 'knex';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../test/docker-manager';
import { KnexGetItemsInFolderQuery } from '@app/inventory/read/infra/queries/get-items-in-folder/knex-get-items-in-folder.query';
import { FolderPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/folder.pm';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';
import { GetItemsInFolderResponse } from '@app/inventory/read/hexagon/queries/get-items-in-folder.query';
import { ItemImagePm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item-image.pm';
import { TagPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/tag.pm';

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

    test('Item has tags', async () => {
      const companyId = '9706cf9d-841e-4541-9eba-a2c7c2c765e6';
      await insertItems([
        {
          id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
          name: 'Iphone 13',
          quantity: 10,
          note: 'This is a note',
          barcodeValue: 'Barcode Value',
          barcodeType: 'ean13',
          companyId,
          folderId: 'd0bf789c-8788-4293-b730-cd05e9c34418',
          createdAt: new Date('2024-01-01'),
        },
      ]);

      await insertTags([
        {
          id: '2f87933c-dd6d-41aa-a5e0-fc863823676a',
          companyId,
          createdAt: new Date('2024-01-01'),
          name: 'Tag 1',
        },
        {
          id: '59c589fb-9d30-47f3-83a2-057bc2893c54',
          name: 'Tag 2',
          companyId,
          createdAt: new Date('2024-01-01'),
        },
      ]);

      await insertItemTags([
        {
          itemId: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
          tagId: '2f87933c-dd6d-41aa-a5e0-fc863823676a',
        },
        {
          itemId: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
          tagId: '59c589fb-9d30-47f3-83a2-057bc2893c54',
        },
      ]);

      const item = await knexGetItemsInFolder.execute({
        companyId,
        folderId: 'd0bf789c-8788-4293-b730-cd05e9c34418',
      });

      expect(item).toEqual<GetItemsInFolderResponse>([
        expect.objectContaining({
          tags: [
            { id: '2f87933c-dd6d-41aa-a5e0-fc863823676a', name: 'Tag 1' },
            { id: '59c589fb-9d30-47f3-83a2-057bc2893c54', name: 'Tag 2' },
          ],
        }),
      ]);
    });
  });

  const insertItems = async (items: ItemPm[]) => {
    await sqlConnection('items').insert(items);
  };

  const insertImage = (image: ItemImagePm) => {
    return sqlConnection<ItemPm>('item_images').insert(image);
  };

  const insertTags = (tags: TagPm[]) => {
    return sqlConnection<TagPm>('tags').insert(tags);
  };

  const insertItemTags = (itemTags: { itemId: string; tagId: string }[]) => {
    return sqlConnection('items_tags').insert(itemTags);
  };
});
