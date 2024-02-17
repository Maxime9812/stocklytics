import { Item } from '@app/inventory/write/hexagon/models/item';
import { TransactionalAsync } from '@app/shared/transaction-performing/transaction-performer';
import { Barcode } from '@app/inventory/write/hexagon/models/barcode';

export interface ItemsRepository {
  save(item: Item): TransactionalAsync;
  getById(id: string): Promise<Item | undefined>;
  delete(item: Item): TransactionalAsync;
  getItemIdByBarcode(
    barcode: Barcode,
    companyId: string,
  ): Promise<string | undefined>;
}
