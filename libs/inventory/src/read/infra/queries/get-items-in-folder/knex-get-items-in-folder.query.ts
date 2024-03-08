import {
  GetItemsInFolderPayload,
  GetItemsInFolderQuery,
  GetItemsInFolderResponse,
} from '@app/inventory/read/hexagon/queries/get-items-in-folder.query';
import { Knex } from 'knex';
import { ItemImagePm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item-image.pm';
import { TagPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/tag.pm';

export class KnexGetItemsInFolderQuery implements GetItemsInFolderQuery {
  constructor(private readonly knex: Knex) {}

  async execute(
    payload: GetItemsInFolderPayload,
  ): Promise<GetItemsInFolderResponse> {
    const ref = this.knex.ref('items.id');
    const imageUrlQuery = this.knex<ItemImagePm>('item_images')
      .select('url')
      .where('itemId', ref)
      .first()
      .as('imageUrl');

    const items = await this.knex('items')
      .select(
        'id',
        'name',
        'quantity',
        'folderId',
        'createdAt',
        'note',
        'barcodeValue',
        'barcodeType',
        imageUrlQuery,
      )
      .where({
        folderId: payload.folderId ?? null,
        companyId: payload.companyId,
      });

    return Promise.all(
      items.map(async (i) => {
        const { barcodeValue, barcodeType, ...item } = i;

        const barcode = barcodeValue
          ? {
              type: barcodeType,
              value: barcodeValue,
            }
          : undefined;

        const tags = await this.knex<TagPm>('items_tags')
          .where('itemId', item.id)
          .innerJoin('tags', 'items_tags.tagId', 'tags.id')
          .select('tags.name', 'tags.id');

        return {
          ...item,
          imageUrl: i.imageUrl ?? undefined,
          barcode,
          tags,
        };
      }),
    );
  }
}
