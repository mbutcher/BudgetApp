import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_dashboard_config', (table) => {
    // Acknowledged rollover periods: JSON object { "YYYY-MM-DD_YYYY-MM-DD": "ISO_TIMESTAMP" }
    table.json('acknowledged_rollovers').nullable().defaultTo(null);
    // Timestamp of last annual budget line review; null = never reviewed
    table.datetime('budget_lines_last_reviewed_at').nullable().defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('user_dashboard_config', (table) => {
    table.dropColumn('acknowledged_rollovers');
    table.dropColumn('budget_lines_last_reviewed_at');
  });
}
