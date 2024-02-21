import { Knex } from 'knex';
import { ItemsRepository } from '@app/inventory/write/hexagon/gateways/repositories/items.repository';
import { Item } from '@app/inventory/write/hexagon/models/item';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';
import { TransactionalAsync } from '@app/shared/transaction-performing/transaction-performer';
import {
  Barcode,
  BarcodeType,
} from '@app/inventory/write/hexagon/models/barcode';
import { ItemImagePm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item-image.pm';

export class KnexItemsRepository implements ItemsRepository {
  constructor(private readonly knex: Knex) {}

  save(item: Item): TransactionalAsync {
    return async (trx) => {
      const {
        id,
        name,
        quantity,
        companyId,
        createdAt,
        folderId,
        note,
        barcode,
      } = item.snapshot;
      await this.knex('items')
        .transacting(trx as Knex.Transaction)
        .insert({
          id,
          name,
          quantity,
          companyId,
          note,
          folderId,
          barcodeType: barcode?.type,
          barcodeValue: barcode?.value,
          createdAt,
        })
        .onConflict('id')
        .merge();

      await this.saveItemTags(item)(trx);
      await this.saveItemImage(item)(trx);
    };
  }

  async getById(id: string): Promise<Item | undefined> {
    const itemPm = await this.knex<ItemPm>('items').where({ id }).first();

    const image = await this.knex<ItemImagePm>('item_images')
      .select('*')
      .where({ itemId: id })
      .first();

    const tagIds = await this.knex('items_tags')
      .select<{ tagId: string }[]>('tagId')
      .where({ itemId: id });

    if (!itemPm) return;

    const {
      name,
      quantity,
      companyId,
      createdAt,
      folderId,
      note,
      barcodeType,
      barcodeValue,
    } = itemPm;
    return Item.fromSnapshot({
      id: itemPm.id,
      name,
      quantity,
      companyId,
      createdAt,
      folderId,
      note,
      barcode: barcodeType
        ? { type: barcodeType as BarcodeType, value: barcodeValue }
        : undefined,
      tagIds: tagIds.map((tagId) => tagId.tagId),
      image: image ? image : undefined,
    });
  }

  delete(item: Item): TransactionalAsync {
    return async (trx) => {
      await this.knex
        .delete()
        .from('items')
        .where({ id: item.id })
        .transacting(trx as Knex.Transaction);

      await this.knex
        .delete()
        .from('items_tags')
        .where({ itemId: item.id })
        .transacting(trx as Knex.Transaction);
    };
  }

  async getItemIdByBarcode(
    barcode: Barcode,
    companyId: string,
  ): Promise<string | undefined> {
    const query = await this.knex<ItemPm>('items').first('id').where({
      companyId,
      barcodeType: barcode.type,
      barcodeValue: barcode.value,
    });
    return query?.id;
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

  private saveItemImage(item: Item): TransactionalAsync {
    return async (trx) => {
      const { image } = item.snapshot;

      await this.knex('item_images')
        .where({ itemId: item.id })
        .del()
        .transacting(trx as Knex.Transaction);

      if (!image) return;

      await this.knex('item_images')
        .transacting(trx as Knex.Transaction)
        .insert({
          id: image.id,
          itemId: item.id,
          url: image.url,
        });
    };
  }
}
