import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('transaction_tags', (table) => {
    table.string('id', 36).primary();
    table
      .string('transaction_id', 36)
      .notNullable()
      .references('id')
      .inTable('transactions')
      .onDelete('CASCADE');
    table.string('user_id', 36).notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.string('tag', 50).notNullable();
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());

    table.unique(['transaction_id', 'tag']);
    table.index(['user_id', 'tag']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('transaction_tags');
}
