import { Item } from '@app/inventory/write/hexagon/models/item';

export interface ItemsRepository {
  save(item: Item): Promise<void>;
  getById(id: string): Promise<Item | undefined>;
}
