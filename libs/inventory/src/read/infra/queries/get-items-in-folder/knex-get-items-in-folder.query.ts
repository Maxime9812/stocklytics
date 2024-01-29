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
    return this.knex<ItemPm>('items')
      .select('id', 'name', 'quantity', 'folderId', 'createdAt')
      .where({
        folderId: payload.folderId ?? null,
        companyId: payload.companyId,
      });
  }
}
