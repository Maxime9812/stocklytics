import { TagsRepository } from '@app/inventory/write/hexagon/gateways/repositories/tags.repository';
import { Knex } from 'knex';
import { Tag } from '@app/inventory/write/hexagon/models/tag';
import { TagPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/tag.pm';

export class KnexTagsRepository implements TagsRepository {
  constructor(private readonly knex: Knex) {}

  async save(tag: Tag): Promise<void> {
    const { id, name, companyId, createdAt } = tag.snapshot;
    await this.knex('tags')
      .insert({
        id,
        name,
        companyId,
        createdAt,
      })
      .onConflict('id')
      .merge();
  }

  async getById(id: string): Promise<Tag | undefined> {
    const tagPm = await this.knex<TagPm>('tags').where({ id }).first();

    if (!tagPm) return;

    const { name, companyId, createdAt } = tagPm;
    return Tag.fromSnapshot({
      id: tagPm.id,
      name,
      companyId,
      createdAt,
    });
  }

  async tagWithNameExists(name: string): Promise<boolean> {
    const tag = await this.knex<TagPm>('tags').where({ name }).first();
    return !!tag;
  }
}
