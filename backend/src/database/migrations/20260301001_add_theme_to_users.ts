import type { Knex } from 'knex';
import { isSQLite } from '../../utils/db/dialectHelper';

export async function up(knex: Knex): Promise<void> {
  // SQLite does not allow CHECK constraints on ALTER TABLE ADD COLUMN.
  // Use a plain string column on SQLite; enum on MySQL/PostgreSQL.
  await knex.schema.alterTable('users', (table) => {
    if (isSQLite(knex)) {
      table.string('theme', 20).notNullable().defaultTo('default');
    } else {
      table
        .enum('theme', ['default', 'slate', 'forest', 'warm', 'midnight'])
        .notNullable()
        .defaultTo('default')
        .after('week_start');
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('theme');
  });
}
