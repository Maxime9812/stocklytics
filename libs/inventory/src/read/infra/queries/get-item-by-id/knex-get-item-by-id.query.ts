import {
  GetItemByIdQuery,
  GetItemByIdResponse,
} from '@app/inventory/read/hexagon/queries/get-item-by-id.query';
import { Knex } from 'knex';
import { ItemImagePm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item-image.pm';

export class KnexGetItemByIdQuery implements GetItemByIdQuery {
  constructor(private readonly knex: Knex) {}

  async execute(id: string): Promise<GetItemByIdResponse | undefined> {
    const imageUrlQuery = this.knex<ItemImagePm>('item_images')
      .select('url')
      .where('itemId', id)
      .first()
      .as('imageUrl');

    const { barcodeValue, barcodeType, imageUrl, ...item } = await this.knex(
      'items',
    )
      .select(
        'companyId',
        'createdAt',
        'folderId',
        'id',
        'name',
        'note',
        'quantity',
        'barcodeType',
        'barcodeValue',
        imageUrlQuery,
      )
      .where('id', id)
      .first();

    const barcode = barcodeValue
      ? {
          type: barcodeType,
          value: barcodeValue,
        }
      : undefined;

    return {
      ...item,
      imageUrl: imageUrl ?? undefined,
      barcode,
      tags: [],
    };
  }
}
