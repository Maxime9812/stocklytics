import {
  GetItemByIdQuery,
  GetItemByIdResponse,
} from '@app/inventory/read/hexagon/queries/get-item-by-id.query';
import { Knex } from 'knex';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';

export class KnexGetItemByIdQuery implements GetItemByIdQuery {
  constructor(private readonly knex: Knex) {}

  async execute(id: string): Promise<GetItemByIdResponse | undefined> {
    const { barcodeValue, barcodeType, ...item } = await this.knex<ItemPm>(
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
      barcode,
      tags: [],
    };
  }
}
