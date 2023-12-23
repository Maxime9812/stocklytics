import { Item } from '@app/inventory/hexagon/models/item';

export interface ItemsRepository {
  save(item: Item): Promise<void>;
}
