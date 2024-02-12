import {
  GetItemByIdQuery,
  GetItemByIdResponse,
} from '@app/inventory/read/hexagon/queries/get-item-by-id.query';
import { Knex } from 'knex';

export class KnexGetItemByIdQuery implements GetItemByIdQuery {
  constructor(private readonly knex: Knex) {}

  execute(id: string): Promise<GetItemByIdResponse | undefined> {
    return this.knex('items')
      .select(
        'companyId',
        'createdAt',
        'folderId',
        'id',
        'name',
        'note',
        'quantity',
      )
      .where('id', id)
      .first();
  }
}
