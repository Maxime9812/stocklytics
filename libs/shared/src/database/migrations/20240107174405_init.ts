import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('folders', (table) => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.uuid('companyId').notNullable();
      table.uuid('parentId').nullable();
      table.datetime('createdAt').notNullable();
    })
    .createTable('items', (table) => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.string('note').notNullable();
      table.integer('quantity').notNullable();
      table.uuid('companyId').notNullable();
      table.string('barcodeType').nullable();
      table.string('barcodeValue').nullable();
      table.uuid('folderId').nullable();
      table.datetime('createdAt').notNullable();
    })
    .createTable('tags', (table) => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.uuid('companyId').notNullable();
      table.datetime('createdAt').notNullable();
    })
    .createTable('items_tags', (table) => {
      table.uuid('itemId').notNullable();
      table.uuid('tagId').notNullable();

      table.primary(['itemId', 'tagId']);
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema
    .dropTableIfExists('items_tags')
    .dropTableIfExists('items')
    .dropTableIfExists('tags')
    .dropTableIfExists('folders');
}
