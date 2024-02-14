import knex, { Knex } from 'knex';

import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../test/docker-manager';
import { KnexScanBarcodeQuery } from '@app/inventory/read/infra/queries/scan-barcode/knex-scan-barcode.query';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';

describe('KnexScanBarcodeQuery', () => {
  let sqlConnection: Knex;
  let knexScanBarcodeQuery: KnexScanBarcodeQuery;
  const companyId = '64c38eb8-21ca-4b8c-9b00-88b13bbedfcb';
  const anotherCompanyId = '5ba60c41-f3e8-4bad-9c09-6f813e94cbf1';

  beforeAll(async () => {
    sqlConnection = knex(knexConfig.test);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
    knexScanBarcodeQuery = new KnexScanBarcodeQuery(sqlConnection);
  });
  describe('Item', () => {
    test('Item is linked', async () => {
      const itemId = 'e952afa2-2df6-4bab-998a-cb6971addb18';
      await insertItem({
        id: itemId,
        name: 'Iphone 13',
        quantity: 10,
        companyId,
        note: '',
        createdAt: new Date('2024-01-01'),
        barcodeType: 'ean13',
        barcodeValue: 'barcode-value',
      });
      const scan = await knexScanBarcodeQuery.execute({
        barcode: {
          type: 'ean13',
          value: 'barcode-value',
        },
        companyId,
      });
      expect(scan).toEqual({
        type: 'item',
        id: itemId,
      });
    });
    test('No item is linked', async () => {
      const scan = await knexScanBarcodeQuery.execute({
        barcode: {
          type: 'ean13',
          value: 'barcode-value',
        },
        companyId,
      });
      expect(scan).toBeUndefined();
    });
    test('Item is not hold by same company', async () => {
      const itemId = 'e952afa2-2df6-4bab-998a-cb6971addb18';
      await insertItem({
        id: itemId,
        name: 'Iphone 13',
        quantity: 10,
        companyId: anotherCompanyId,
        note: '',
        createdAt: new Date('2024-01-01'),
        barcodeType: 'ean13',
        barcodeValue: 'barcode-value',
      });
      const scan = await knexScanBarcodeQuery.execute({
        barcode: {
          type: 'ean13',
          value: 'barcode-value',
        },
        companyId,
      });
      expect(scan).toBeUndefined();
    });
  });

  const insertItem = (item: ItemPm) => {
    return sqlConnection<ItemPm>('items').insert(item);
  };
});
