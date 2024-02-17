import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { Item, ItemSnapshot } from '@app/inventory/write/hexagon/models/item';
import { TransactionalAsync } from '@app/shared/transaction-performing/transaction-performer';
import { Barcode } from '@app/inventory/write/hexagon/models/barcode';

export class InMemoryItemsRepository implements ItemsRepository {
  private readonly _items: Map<string, ItemSnapshot> = new Map();
  get items() {
    return [...this._items.values()].map((item) => Item.fromSnapshot(item));
  }

  save(item: Item): TransactionalAsync {
    return async () => {
      this._items.set(item.id, item.snapshot);
    };
  }

  async getById(id: string) {
    return this._items.has(id)
      ? Item.fromSnapshot(this._items.get(id))
      : undefined;
  }

  delete(item: Item): TransactionalAsync {
    return async () => {
      this._items.delete(item.id);
    };
  }

  async getItemIdByBarcode(barcode: Barcode, companyId: string) {
    return this.items.find(
      (i) =>
        i.snapshot.barcode?.value === barcode.value &&
        i.snapshot.barcode?.type === barcode.type &&
        i.snapshot.companyId === companyId,
    )?.id;
  }

  givenItems(...items: Item[]) {
    items.forEach((i) => this._items.set(i.id, i.snapshot));
  }
}
