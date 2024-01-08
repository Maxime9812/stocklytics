import knex, { Knex } from 'knex';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../../test/docker-manager';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';
import { KnexItemsRepository } from '@app/inventory/write/infra/gateways/repositories/knex/knex-items.repository';
import { folderBuilder } from '@app/inventory/write/hexagon/__tests__/builders/folder.builder';
import { Item } from '@app/inventory/write/hexagon/models/item';
import { tagBuilder } from '@app/inventory/write/hexagon/__tests__/builders/tag.builder';

describe('KnexItemsRepository', () => {
  let sqlConnection: Knex;

  beforeAll(async () => {
    sqlConnection = knex(knexConfig.test);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
  });

  describe('save', () => {
    it('should save an item', async () => {
      await createFolder('349b8b68-109a-486f-bdc2-daedc31a6beb');
      const item = itemBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .withName('Iphone 13 pro max')
        .withQuantity(1)
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'))
        .withFolderId('349b8b68-109a-486f-bdc2-daedc31a6beb')
        .build();

      await new KnexItemsRepository(sqlConnection).save(item);

      expect(await findExistingItems()).toEqual<ItemPm[]>([
        {
          id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
          name: 'Iphone 13 pro max',
          quantity: 1,
          companyId: '60dfbc60-1594-4a0c-9397-7f6e70cf25af',
          folderId: '349b8b68-109a-486f-bdc2-daedc31a6beb',
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
        },
      ]);
    });

    it('should update item instead of create a new one if item already exists', async () => {
      const initialItemBuilder = itemBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .withName('Iphone 13 pro max')
        .withQuantity(1)
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'));
      const initialItem = initialItemBuilder.build();
      await insertItem(initialItem);

      const item = initialItemBuilder.withQuantity(2).build();

      await new KnexItemsRepository(sqlConnection).save(item);

      expect(await findExistingItems()).toEqual<ItemPm[]>([
        {
          id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
          name: 'Iphone 13 pro max',
          quantity: 2,
          companyId: '60dfbc60-1594-4a0c-9397-7f6e70cf25af',
          folderId: null,
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
        },
      ]);
    });

    it('should save an item with tags', async () => {
      await createTag('f262a4be-f09d-4370-a2a7-698df42f135f');
      await createTag('3320b243-836b-4629-8b36-44d088c62e00');
      const item = itemBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .withName('Iphone 13 pro max')
        .withQuantity(1)
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'))
        .whitTagIds(
          'f262a4be-f09d-4370-a2a7-698df42f135f',
          '3320b243-836b-4629-8b36-44d088c62e00',
        )
        .build();

      await new KnexItemsRepository(sqlConnection).save(item);

      expect(await findExistingItemsTag()).toEqual([
        {
          itemId: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
          tagId: 'f262a4be-f09d-4370-a2a7-698df42f135f',
        },
        {
          itemId: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
          tagId: '3320b243-836b-4629-8b36-44d088c62e00',
        },
      ]);
    });

    it('should update item tags instead of create a new one if item already exists', async () => {
      await createTag('f262a4be-f09d-4370-a2a7-698df42f135f');
      await createTag('3320b243-836b-4629-8b36-44d088c62e00');
      const initialItemBuilder = itemBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .withName('Iphone 13 pro max')
        .withQuantity(1)
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'))
        .whitTagIds(
          'f262a4be-f09d-4370-a2a7-698df42f135f',
          '3320b243-836b-4629-8b36-44d088c62e00',
        );
      const initialItem = initialItemBuilder.build();
      await insertItem(initialItem);

      const item = initialItemBuilder
        .whitTagIds('f262a4be-f09d-4370-a2a7-698df42f135f')
        .build();

      await new KnexItemsRepository(sqlConnection).save(item);

      expect(await findExistingItemsTag()).toEqual([
        {
          itemId: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
          tagId: 'f262a4be-f09d-4370-a2a7-698df42f135f',
        },
      ]);
    });
  });

  describe('getById', () => {
    it('should return a simple item by id', async () => {
      await createFolder('349b8b68-109a-486f-bdc2-daedc31a6beb');
      const item = itemBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .withName('Iphone 13 pro max')
        .withQuantity(1)
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'))
        .withFolderId('349b8b68-109a-486f-bdc2-daedc31a6beb')
        .build();
      await insertItem(item);

      const result = await new KnexItemsRepository(sqlConnection).getById(
        'b33adf7e-3ae7-4f17-9560-3388251c266f',
      );

      expect(result?.snapshot).toEqual(item.snapshot);
    });

    it('should return a id with tags', async () => {
      await createFolder('349b8b68-109a-486f-bdc2-daedc31a6beb');
      await createTag('f262a4be-f09d-4370-a2a7-698df42f135f');
      const item = itemBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .withName('Iphone 13 pro max')
        .withQuantity(1)
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'))
        .withFolderId('349b8b68-109a-486f-bdc2-daedc31a6beb')
        .whitTagIds('f262a4be-f09d-4370-a2a7-698df42f135f')
        .build();
      await insertItem(item);

      const result = await new KnexItemsRepository(sqlConnection).getById(
        'b33adf7e-3ae7-4f17-9560-3388251c266f',
      );

      expect(result?.snapshot).toEqual(item.snapshot);
    });
  });

  const createTag = async (tagId: string) => {
    const tag = tagBuilder().withId(tagId).build();
    const tagSnapshot = tag.snapshot;
    await sqlConnection('tags').insert({
      id: tagSnapshot.id,
      name: tagSnapshot.name,
      companyId: tagSnapshot.companyId,
      createdAt: tagSnapshot.createdAt,
    });
  };

  const findExistingItems = async () => {
    return sqlConnection('items').select<ItemPm[]>('*');
  };
  const findExistingItemsTag = async () => {
    return sqlConnection('items_tags').select('*');
  };

  const insertItem = async (item: Item) => {
    const { id, name, quantity, companyId, createdAt, folderId, tagIds } =
      item.snapshot;
    await sqlConnection('items').insert({
      id,
      name,
      quantity,
      companyId,
      folderId,
      createdAt,
    });

    if (!tagIds.length) return;

    await sqlConnection('items_tags').insert(
      tagIds.map((tagId) => ({ itemId: id, tagId })),
    );
  };

  const createFolder = async (folderId: string) => {
    const folder = folderBuilder().withId(folderId).build();
    const folderSnapshot = folder.snapshot;
    await sqlConnection('folders').insert({
      id: folderSnapshot.id,
      name: folderSnapshot.name,
      companyId: folderSnapshot.companyId,
      createdAt: folderSnapshot.createdAt,
    });
  };
});
