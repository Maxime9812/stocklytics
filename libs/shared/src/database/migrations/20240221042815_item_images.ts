import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('item_images', (table) => {
    table.uuid('id').primary();
    table.uuid('itemId').notNullable();
    table.string('url').notNullable();
    table
      .foreign('itemId')
      .references('id')
      .inTable('items')
      .onDelete('CASCADE');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('item_images');
}
