import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('savings_goals', (table) => {
    table
      .specificType('budget_line_id', 'CHAR(36)')
      .nullable()
      .references('id')
      .inTable('budget_lines')
      .onDelete('SET NULL')
      .after('account_id');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('savings_goals', (table) => {
    table.dropForeign(['budget_line_id']);
  });
  await knex.schema.alterTable('savings_goals', (table) => {
    table.dropColumn('budget_line_id');
  });
}
