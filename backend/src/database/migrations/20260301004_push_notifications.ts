import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Table to store per-device push subscriptions
  await knex.schema.createTable('push_subscriptions', (table) => {
    table.uuid('id').primary();
    table.uuid('user_id').notNullable().references('id').inTable('users').onDelete('CASCADE');
    table.text('endpoint').notNullable();
    table.string('p256dh', 512).notNullable();
    table.string('auth', 512).notNullable();
    table.string('device_name', 255).nullable();
    table.datetime('created_at').notNullable().defaultTo(knex.fn.now());
    table.index('user_id');
  });

  // User-level push opt-in and per-type preferences
  await knex.schema.alterTable('users', (table) => {
    table.boolean('push_enabled').notNullable().defaultTo(false);
    table.json('push_preferences').nullable().defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('push_subscriptions');
  await knex.schema.alterTable('users', (table) => {
    table.dropColumn('push_enabled');
    table.dropColumn('push_preferences');
  });
}
