import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('refresh_tokens', (table) => {
    table.string('device_name', 100).nullable().after('user_agent');
    table.timestamp('last_used_at').nullable().after('device_name');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('refresh_tokens', (table) => {
    table.dropColumn('device_name');
    table.dropColumn('last_used_at');
  });
}
