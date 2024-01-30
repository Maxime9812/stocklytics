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
  ): Promise<GetFoldersInFolderResponse> {
    const values = await this.knex('folders')
      .select('id', 'name', 'parentId', 'createdAt')
      .where({
        parentId: payload.folderId ?? null,
        companyId: payload.companyId,
      });
    return values.map((v) => ({
      id: v.id,
      name: v.name,
      parentId: v.parentId,
      createdAt: v.createdAt,
      itemQuantity: 0,
    }));
  }
}
