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
    const idRef = this.knex.ref('RecursiveFolders.id');

    const folders = await this.knex('folders')
      .select('id', 'name', 'parentId', 'createdAt')
      .where({
        parentId: payload.folderId ?? null,
        companyId: payload.companyId,
      });

    return await Promise.all(
      folders.map(async (folder) => {
        const response = await this.knex
          .withRecursive('RecursiveFolders', (qb) => {
            qb.select('id', 'parentId')
              .from('folders')
              .where({
                parentId: folder.id,
              })
              .union((qb) => {
                qb.select('f.id', 'f.parentId')
                  .from('folders as f')
                  .join('RecursiveFolders as rf', 'f.parentId', 'rf.id');
              });
          })
          .from('items')
          .sum('quantity')
          .leftOuterJoin(
            'RecursiveFolders',
            'items.folderId',
            'RecursiveFolders.id',
          )
          .where('folderId', idRef)
          .orWhere('folderId', folder.id);

        return {
          ...folder,
          itemQuantity: Number(response[0].sum),
        };
      }),
    );
  }
}
