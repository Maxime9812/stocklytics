import knex, { Knex } from 'knex';
import { knexConfig } from '@app/shared';
import { resetDB } from '../../../../../../../../test/docker-manager';
import { KnexTagsRepository } from '@app/inventory/write/infra/gateways/repositories/knex/knex-tags.repository';
import { tagBuilder } from '@app/inventory/write/hexagon/__tests__/builders/tag.builder';
import { ItemPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/item.pm';
import { TagPm } from '@app/inventory/write/infra/gateways/repositories/knex/persistent-models/tag.pm';
import { Tag } from '@app/inventory/write/hexagon/models/tag';

describe('KnexTagsRepository', () => {
  let sqlConnection: Knex;

  beforeAll(async () => {
    sqlConnection = knex(knexConfig.test);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await resetDB(sqlConnection);
  });

  describe('save', () => {
    it('should save a tag', async () => {
      const tag = tagBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .withName('Phone')
        .whitCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .withCreatedAt(new Date('2024-01-01T00:00:00.000Z'))
        .build();

      await new KnexTagsRepository(sqlConnection).save(tag);

      expect(await findExistingTags()).toEqual<TagPm[]>([
        {
          id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
          name: 'Phone',
          companyId: '60dfbc60-1594-4a0c-9397-7f6e70cf25af',
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
        },
      ]);
    });

    it('should update tag instead of create a new one if tag already exists', async () => {
      const initialTagBuilder = tagBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .withName('Phone')
        .whitCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .withCreatedAt(new Date('2024-01-01T00:00:00.000Z'));
      const initialTag = initialTagBuilder.build();
      await insertTag(initialTag);

      const tag = initialTagBuilder.withName('Computer').build();
      await new KnexTagsRepository(sqlConnection).save(tag);

      expect(await findExistingTags()).toEqual<TagPm[]>([
        {
          id: 'b33adf7e-3ae7-4f17-9560-3388251c266f',
          name: 'Computer',
          companyId: '60dfbc60-1594-4a0c-9397-7f6e70cf25af',
          createdAt: new Date('2024-01-01T00:00:00.000Z'),
        },
      ]);
    });
  });

  describe('getById', () => {
    it('should return a tag by id', async () => {
      const tag = tagBuilder()
        .withId('b33adf7e-3ae7-4f17-9560-3388251c266f')
        .withName('Phone')
        .whitCompanyId('60dfbc60-1594-4a0c-9397-7f6e70cf25af')
        .withCreatedAt(new Date('2024-01-01T00:00:00.000Z'))
        .build();
      await insertTag(tag);

      const tagFromRepo = await new KnexTagsRepository(sqlConnection).getById(
        'b33adf7e-3ae7-4f17-9560-3388251c266f',
      );

      expect(tagFromRepo?.snapshot).toEqual(tag.snapshot);
    });
    it('should return undefined if tag does not exist', async () => {
      const tagFromRepo = await new KnexTagsRepository(sqlConnection).getById(
        'b33adf7e-3ae7-4f17-9560-3388251c266f',
      );

      expect(tagFromRepo).toBeUndefined();
    });
  });

  describe('tagWithNameExists', () => {
    it('should return false if tag with name does NOT exist', async () => {
      const tagWithNameExists = await new KnexTagsRepository(
        sqlConnection,
      ).tagWithNameExists('Phone');

      expect(tagWithNameExists).toBe(false);
    });

    it('should return true if tag with name exists', async () => {
      const tag = tagBuilder().withName('Phone').build();
      await insertTag(tag);

      const tagWithNameExists = await new KnexTagsRepository(
        sqlConnection,
      ).tagWithNameExists('Phone');

      expect(tagWithNameExists).toBe(true);
    });
  });

  const insertTag = async (tag: Tag) => {
    const { id, name, companyId, createdAt } = tag.snapshot;
    await sqlConnection('tags').insert({
      id,
      name,
      companyId,
      createdAt,
    });
  };

  const findExistingTags = async () => {
    return sqlConnection('tags').select<TagPm[]>('*');
  };
});
