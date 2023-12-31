import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/items.repository';
import { Item, ItemSnapshot } from '@app/inventory/write/hexagon/models/item';

export class InMemoryItemsRepository implements ItemsRepository {
  private readonly _items: Map<string, ItemSnapshot> = new Map();
  get items() {
    return Array.from(this._items.values());
  }

  async save(item: Item) {
    this._items.set(item.id, item.snapshot);
  }
}
