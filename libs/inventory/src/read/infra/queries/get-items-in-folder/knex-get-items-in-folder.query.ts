import {
  GetItemsInFolderPayload,
  GetItemsInFolderQuery,
  GetItemsInFolderResponse,
} from '@app/inventory/read/hexagon/queries/get-items-in-folder.query';
import { Knex } from 'knex';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';

export class KnexGetItemsInFolderQuery implements GetItemsInFolderQuery {
  constructor(private readonly knex: Knex) {}

  async execute(
    payload: GetItemsInFolderPayload,
  ): Promise<GetItemsInFolderResponse> {
    const items = await this.knex<ItemPm>('items')
      .select(
        'id',
        'name',
        'quantity',
        'folderId',
        'createdAt',
        'note',
        'barcodeValue',
        'barcodeType',
      )
      .where({
        folderId: payload.folderId ?? null,
        companyId: payload.companyId,
      });

    return items.map((i) => {
      const { barcodeValue, barcodeType, ...item } = i;

      const barcode = barcodeValue
        ? {
            type: barcodeType,
            value: barcodeValue,
          }
        : undefined;

      return {
        ...item,
        barcode,
      };
    });
  }
}
