import {
  GetTagsQuery,
  GetTagsResponse,
} from '@app/inventory/read/hexagon/queries/get-tags.query';
import { Knex } from 'knex';

export class KnexGetTagsQuery implements GetTagsQuery {
  constructor(private readonly knex: Knex) {}

  async execute(companyId: string): Promise<GetTagsResponse> {
    return this.knex('tags').select('id', 'name').where('companyId', companyId);
  }
}
