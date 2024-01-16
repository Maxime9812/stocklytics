import {
  GetFoldersInFolderPayload,
  GetFoldersInFolderQuery,
  GetFoldersInFolderResponse,
} from '@app/inventory/read/hexagon/queries/get-folders-in-folder.query';
import { Knex } from 'knex';

export class KnexGetFoldersInFolderQuery implements GetFoldersInFolderQuery {
  constructor(private readonly knex: Knex) {}
  async execute(
    payload: GetFoldersInFolderPayload,
  ): Promise<GetFoldersInFolderResponse | undefined> {
    const folder = await this.knex('folders')
      .first()
      .where({ id: payload.folderId, companyId: payload.companyId });

    if (!folder) return;

    return this.knex('folders')
      .where({ parentId: payload.folderId })
      .select('id', 'name');
  }
}
