import {
  FolderExistParams,
  FoldersRepository,
} from '@app/inventory/write/hexagon/gateways/repositories/folders.repository';
import { Knex } from 'knex';
import { Folder } from '@app/inventory/write/hexagon/models/folder';
import { FolderPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/folder.pm';

export class KnexFoldersRepository implements FoldersRepository {
  constructor(private readonly knex: Knex) {}

  async save(folder: Folder): Promise<void> {
    const { id, name, companyId, parentId, createdAt } = folder.snapshot;
    await this.knex('folders')
      .insert({
        id,
        name,
        companyId,
        parentId,
        createdAt,
      })
      .onConflict('id')
      .merge();
  }

  async getById(id: string): Promise<Folder | undefined> {
    const folderPm = await this.knex<FolderPm>('folders').where({ id }).first();

    if (!folderPm) return;

    const { name, companyId, parentId, createdAt } = folderPm;
    return Folder.fromSnapshot({
      id,
      name,
      companyId,
      parentId,
      createdAt,
    });
  }

  async folderWithNameInParentFolderExists(
    params: FolderExistParams,
  ): Promise<boolean> {
    const { name, parentId, companyId } = params;
    const folderPm = await this.knex<FolderPm>('folders')
      .where({ name, parentId, companyId })
      .first();

    return !!folderPm;
  }
}
