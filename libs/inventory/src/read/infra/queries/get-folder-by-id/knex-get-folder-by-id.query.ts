import {
  GetFolderByIdQuery,
  GetFolderByIdResponse,
} from '@app/inventory/read/hexagon/queries/get-folder-by-id.query';
import { Knex } from 'knex';

export class KnexGetFolderByIdQuery implements GetFolderByIdQuery {
  constructor(private readonly knex: Knex) {}

  async execute(id: string): Promise<GetFolderByIdResponse | undefined> {
    const folder = await this.knex
      .from('folders')
      .where('id', id)
      .select('id', 'name', 'parentId', 'companyId', 'createdAt')
      .first();
    if (!folder) {
      return;
    }
    return {
      ...folder,
      itemQuantity: 0,
    };
  }
}
