import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/items.repository';
import { Item, ItemSnapshot } from '@app/inventory/write/hexagon/models/item';

export class InMemoryItemsRepository implements ItemsRepository {
  private readonly _items: Map<string, ItemSnapshot> = new Map();
  get items() {
    return [...this._items.values()].map((item) => Item.fromSnapshot(item));
  }

  async save(item: Item) {
    this._items.set(item.id, item.snapshot);
  }

  givenItems(...items: Item[]) {
    items.forEach((i) => this._items.set(i.id, i.snapshot));
  }
}
