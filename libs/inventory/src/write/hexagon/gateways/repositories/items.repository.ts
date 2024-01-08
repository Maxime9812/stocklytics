import { Item } from '@app/inventory/write/hexagon/models/item';
import { TransactionalAsync } from '@app/inventory/write/hexagon/gateways/transaction-performing/transaction-performer';

export interface ItemsRepository {
  save(item: Item): TransactionalAsync;
  getById(id: string): Promise<Item | undefined>;
}
