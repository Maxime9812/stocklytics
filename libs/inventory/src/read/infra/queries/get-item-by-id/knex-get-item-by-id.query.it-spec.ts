import knex, { Knex } from 'knex';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../test/docker-manager';
import { KnexGetItemByIdQuery } from '@app/inventory/read/infra/queries/get-item-by-id/knex-get-item-by-id.query';
import { GetItemByIdResponse } from '@app/inventory/read/hexagon/queries/get-item-by-id.query';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';
import { ItemImagePm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item-image.pm';
import { TagPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/tag.pm';

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
      tags: [],
      createdAt: new Date('2024-01-01'),
    });
  });

  test('Item has barcode', async () => {
    await insertItems([
      {
        id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
        name: 'Iphone 13',
        quantity: 10,
        note: 'This is a note',
        barcodeValue: 'Barcode Value',
        barcodeType: 'ean13',
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
      barcode: {
        type: 'ean13',
        value: 'Barcode Value',
      },
      tags: [],
      createdAt: new Date('2024-01-01'),
    });
  });

  test('Item has image', async () => {
    await insertItems([
      {
        id: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
        name: 'Iphone 13',
        quantity: 10,
        note: 'This is a note',
        barcodeValue: 'Barcode Value',
        barcodeType: 'ean13',
        companyId: '9706cf9d-841e-4541-9eba-a2c7c2c765e6',
        folderId: 'd0bf789c-8788-4293-b730-cd05e9c34418',
        createdAt: new Date('2024-01-01'),
      },
    ]);

    await insertImage({
      id: 'b0bf789c-8788-4293-b730-cd05e9c34416',
      itemId: 'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
      url: 'http://localhost:3000/image.jpg',
    });

    const item = await knexGetItemByIdQuery.execute(
      'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
    );

    expect(item).toEqual<GetItemByIdResponse>(
      expect.objectContaining({
        imageUrl: 'http://localhost:3000/image.jpg',
      }),
    );
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

    const item = await knexGetItemByIdQuery.execute(
      'e2dea07f-6a2c-48a1-9c20-5d4905598e75',
    );

    expect(item).toEqual<GetItemByIdResponse>(
      expect.objectContaining({
        tags: [
          { id: '2f87933c-dd6d-41aa-a5e0-fc863823676a', name: 'Tag 1' },
          { id: '59c589fb-9d30-47f3-83a2-057bc2893c54', name: 'Tag 2' },
        ],
      }),
    );
  });

  const insertItems = (items: ItemPm[]) => {
    return sqlConnection<ItemPm>('items').insert(items);
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
