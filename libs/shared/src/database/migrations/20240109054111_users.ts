import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('companies', (table) => {
      table.uuid('id').primary();
      table.string('name').notNullable();
      table.datetime('createdAt').notNullable();
    })
    .createTable('users', (table) => {
      table.uuid('id').primary();
      table.string('email').notNullable();
      table.string('password').notNullable();
      table.uuid('companyId').notNullable();
      table.datetime('createdAt').notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('companies').dropTableIfExists('users');
}
