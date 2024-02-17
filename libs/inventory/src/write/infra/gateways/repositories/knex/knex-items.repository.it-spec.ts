import knex, { Knex } from 'knex';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../../test/docker-manager';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';
import { itemBuilder } from '@app/inventory/write/hexagon/__tests__/builders/item.builder';
import { KnexItemsRepository } from '@app/inventory/write/infra/gateways/repositories/knex/knex-items.repository';
import { Item } from '@app/inventory/write/hexagon/models/item';
import { KnexTransactionPerformer } from '@app/shared/transaction-performing/knex-transacrion-performer';

describe('KnexItemsRepository', () => {
  let sqlConnection: Knex;
  let transactionPerformer: KnexTransactionPerformer;
  let itemsRepository: KnexItemsRepository;

  beforeAll(async () => {
    sqlConnection = knex(knexConfig.test);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
    transactionPerformer = new KnexTransactionPerformer(sqlConnection);
    itemsRepository = new KnexItemsRepository(sqlConnection);
  });

  describe('save', () => {
    it('should save an item', async () => {
      const item = itemBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .withName('Iphone 13 pro max')
        .withQuantity(1)
        .withNote('This is a note')
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'))
        .withFolderId('349b8b68-109a-486f-bdc2-daedc31a6beb')
        .withBarcode({
          type: 'ean13',
          value: '123456789012',
        })
        .build();

      await transactionPerformer.perform(async (trx) => {
        await itemsRepository.save(item)(trx);
      });

      expect(await findExistingItems()).toEqual<ItemPm[]>([
        {
          id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
          name: 'Iphone 13 pro max',
          quantity: 1,
          note: 'This is a note',
          companyId: '60dfbc60-1594-4a0c-9397-7f6e70cf25af',
          barcodeType: 'ean13',
          barcodeValue: '123456789012',
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
        .withNote('This is a note')
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'));
      const initialItem = initialItemBuilder.build();
      await insertItem(initialItem);

      const item = initialItemBuilder.withQuantity(2).build();

      await transactionPerformer.perform(async (trx) => {
        await itemsRepository.save(item)(trx);
      });

      expect(await findExistingItems()).toEqual<ItemPm[]>([
        {
          id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
          name: 'Iphone 13 pro max',
          quantity: 2,
          companyId: '60dfbc60-1594-4a0c-9397-7f6e70cf25af',
          folderId: null,
          barcodeType: null,
          barcodeValue: null,
          note: 'This is a note',
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
        },
      ]);
    });

    it('should save an item with tags', async () => {
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

      await transactionPerformer.perform(async (trx) => {
        await itemsRepository.save(item)(trx);
      });

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

      await transactionPerformer.perform(async (trx) => {
        await itemsRepository.save(item)(trx);
      });

      expect(await findExistingItemsTag()).toEqual([
        {
          itemId: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
          tagId: 'f262a4be-f09d-4370-a2a7-698df42f135f',
        },
      ]);
    });

    it('should remove item tags if item has no tags', async () => {
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

      const item = initialItemBuilder.whitTagIds().build();

      await transactionPerformer.perform(async (trx) => {
        await itemsRepository.save(item)(trx);
      });

      expect(await findExistingItemsTag()).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return a simple item by id', async () => {
      const item = itemBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .withName('Iphone 13 pro max')
        .withQuantity(1)
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'))
        .withFolderId('349b8b68-109a-486f-bdc2-daedc31a6beb')
        .build();
      await insertItem(item);

      const result = await itemsRepository.getById(
        'b33adf7e-3ae7-4f17-9560-3388251c266f',
      );

      expect(result?.snapshot).toEqual(item.snapshot);
    });

    it('should return a id with tags', async () => {
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

      const result = await itemsRepository.getById(
        'b33adf7e-3ae7-4f17-9560-3388251c266f',
      );

      expect(result?.snapshot).toEqual(item.snapshot);
    });

    it('Should return item with barcode', async () => {
      const item = itemBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .withName('Iphone 13 pro max')
        .withQuantity(1)
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'))
        .withFolderId('349b8b68-109a-486f-bdc2-daedc31a6beb')
        .withBarcode({
          type: 'ean13',
          value: '123456789012',
        })
        .build();
      await insertItem(item);

      const result = await itemsRepository.getById(
        'b33adf7e-3ae7-4f17-9560-3388251c266f',
      );

      expect(result?.snapshot).toEqual(item.snapshot);
    });
  });

  describe('Delete', () => {
    it('Should delete item', async () => {
      const item = itemBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .build();
      await insertItem(item);

      await transactionPerformer.perform(async (trx) => {
        await itemsRepository.delete(item)(trx);
      });

      expect(await findExistingItems()).toEqual([]);
    });
    it('Should delete item tags', async () => {
      const item = itemBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .whitTagIds('f262a4be-f09d-4370-a2a7-698df42f135f')
        .build();
      await insertItem(item);

      await transactionPerformer.perform(async (trx) => {
        await itemsRepository.delete(item)(trx);
      });

      expect(await findExistingItemsTag()).toEqual([]);
    });
  });

  const findExistingItems = async () => {
    return sqlConnection('items').select<ItemPm[]>('*');
  };
  const findExistingItemsTag = async () => {
    return sqlConnection('items_tags').select('*');
  };

  const insertItem = async (item: Item) => {
    const {
      id,
      name,
      quantity,
      companyId,
      createdAt,
      folderId,
      tagIds,
      note,
      barcode,
    } = item.snapshot;
    await sqlConnection('items').insert({
      id,
      name,
      quantity,
      companyId,
      folderId,
      note,
      createdAt,
      barcodeType: barcode?.type,
      barcodeValue: barcode?.value,
    });

    if (!tagIds.length) return;

    await sqlConnection('items_tags').insert(
      tagIds.map((tagId) => ({ itemId: id, tagId })),
    );
  };

  describe('GetItemByBarcode', () => {
    it('Should return item by barcode', async () => {
      const item = itemBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .withName('Iphone 13 pro max')
        .withQuantity(1)
        .withCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .createdAt(new Date('2024-01-01T00:00:00.000Z'))
        .withFolderId('349b8b68-109a-486f-bdc2-daedc31a6beb')
        .withBarcode({
          type: 'ean13',
          value: '123456789012',
        })
        .build();
      await insertItem(item);

      expect(
        await itemsRepository.getItemIdByBarcode(
          {
            type: 'ean13',
            value: '123456789012',
          },
          '60dfbc60-1594-4a0c-9397-7f6e70cf25af',
        ),
      ).toEqual(item.id);
    });
  });
});
