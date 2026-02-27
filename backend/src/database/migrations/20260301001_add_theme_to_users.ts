import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table
      .enum('theme', ['default', 'slate', 'forest', 'warm', 'midnight'])
      .notNullable()
      .defaultTo('default')
      .after('week_start');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('theme');
  });
}
