import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('folders', (table) => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.string('companyId').notNullable();
      table.uuid('parentId').nullable();
      table.date('createdAt').notNullable();

      table.foreign('parentId').references('id').inTable('folders');
    })
    .createTable('items', (table) => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.integer('quantity').notNullable();
      table.string('companyId').notNullable();
      table.uuid('folderId').nullable();
      table.date('createdAt').notNullable();

      table.foreign('folderId').references('id').inTable('folders');
    })
    .createTable('tags', (table) => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.string('companyId').notNullable();
      table.date('createdAt').notNullable();
    })
    .createTable('items_tags', (table) => {
      table.uuid('itemId').notNullable();
      table.uuid('tagId').notNullable();

      table.primary(['itemId', 'tagId']);
      table.foreign('itemId').references('id').inTable('items');
      table.foreign('tagId').references('id').inTable('tags');
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists('items_tags')
    .dropTableIfExists('items')
    .dropTableIfExists('tags')
    .dropTableIfExists('folders');
}
