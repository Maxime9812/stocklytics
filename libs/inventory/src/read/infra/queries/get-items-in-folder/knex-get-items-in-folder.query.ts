import {
  GetItemsInFolderPayload,
  GetItemsInFolderQuery,
  GetItemsInFolderResponse,
} from '@app/inventory/read/hexagon/queries/get-items-in-folder.query';
import { Knex } from 'knex';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';
import { FolderPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/folder.pm';

export class KnexGetItemsInFolderQuery implements GetItemsInFolderQuery {
  constructor(private readonly knex: Knex) {}

  async execute(
    payload: GetItemsInFolderPayload,
  ): Promise<GetItemsInFolderResponse | undefined> {
    const folder = await this.knex<FolderPm>('folders').first().where({
      id: payload.folderId,
      companyId: payload.companyId,
    });

    if (!folder) return;

    return this.knex<ItemPm>('items')
      .select('id', 'name', 'quantity')
      .where({ folderId: payload.folderId });
  }
}
