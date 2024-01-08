import { Knex } from 'knex';
import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { Item } from '@app/inventory/write/hexagon/models/item';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';
import { TransactionalAsync } from '@app/inventory/write/hexagon/gateways/transaction-performing/transaction-performer';

export class KnexItemsRepository implements ItemsRepository {
  constructor(private readonly knex: Knex) {}

  save(item: Item): TransactionalAsync {
    return async (trx) => {
      const { id, name, quantity, companyId, createdAt, folderId } =
        item.snapshot;
      await this.knex('items')
        .transacting(trx as Knex.Transaction)
        .insert({
          id,
          name,
          quantity,
          companyId,
          folderId,
          createdAt,
        })
        .onConflict('id')
        .merge();

      await this.saveItemTags(item)(trx);
    };
  }

  async getById(id: string): Promise<Item | undefined> {
    const itemPm = await this.knex<ItemPm>('items').where({ id }).first();

    const tagIds = await this.knex('items_tags')
      .select<{ tagId: string }[]>('tagId')
      .where({ itemId: id });

    if (!itemPm) return;

    const { name, quantity, companyId, createdAt, folderId } = itemPm;
    return Item.fromSnapshot({
      id: itemPm.id,
      name,
      quantity,
      companyId,
      createdAt,
      folderId,
      tagIds: tagIds.map((tagId) => tagId.tagId),
    });
  }

  private saveItemTags(item: Item): TransactionalAsync {
    return async (trx) => {
      const { tagIds } = item.snapshot;
      await this.knex('items_tags').where({ itemId: item.id }).del();

      if (!tagIds.length) return;

      await this.knex('items_tags')
        .transacting(trx as Knex.Transaction)
        .insert(
          tagIds.map((tagId) => ({
            tagId,
            itemId: item.id,
          })),
        );
    };
  }
}
