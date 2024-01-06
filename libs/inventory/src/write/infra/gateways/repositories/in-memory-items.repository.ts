import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { Item, ItemSnapshot } from '@app/inventory/write/hexagon/models/item';

export class InMemoryItemsRepository implements ItemsRepository {
  private readonly _items: Map<string, ItemSnapshot> = new Map();
  get items() {
    return [...this._items.values()].map((item) => Item.fromSnapshot(item));
  }

  async save(item: Item) {
    this._items.set(item.id, item.snapshot);
  }

  async getById(id: string) {
    return this._items.has(id)
      ? Item.fromSnapshot(this._items.get(id))
      : undefined;
  }

  givenItems(...items: Item[]) {
    items.forEach((i) => this._items.set(i.id, i.snapshot));
  }
}
