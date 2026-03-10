import type { Knex } from 'knex';
import { isSQLite } from '../../utils/db/dialectHelper';

export async function up(knex: Knex): Promise<void> {
  // SQLite does not allow CHECK constraints on ALTER TABLE ADD COLUMN.
  // Use plain string columns on SQLite; enum (with check constraint or native type) on others.
  const usePlainString = isSQLite(knex);

  await knex.schema.table('users', (table) => {
    table.string('locale', 10).notNullable().defaultTo('en-CA');
    if (usePlainString) {
      table.string('date_format', 20).notNullable().defaultTo('DD/MM/YYYY');
      table.string('time_format', 10).notNullable().defaultTo('12h');
    } else {
      table
        .enum('date_format', ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'])
        .notNullable()
        .defaultTo('DD/MM/YYYY');
      table.enum('time_format', ['12h', '24h']).notNullable().defaultTo('12h');
    }
    table.string('timezone', 100).notNullable().defaultTo('America/Toronto');
    if (usePlainString) {
      table.string('week_start', 20).notNullable().defaultTo('sunday');
    } else {
      table.enum('week_start', ['sunday', 'monday', 'saturday']).notNullable().defaultTo('sunday');
    }
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('users', (table) => {
    table.dropColumn('locale');
    table.dropColumn('date_format');
    table.dropColumn('time_format');
    table.dropColumn('timezone');
    table.dropColumn('week_start');
  });
}
