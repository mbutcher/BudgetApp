import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1. Create the new normalized table
  await knex.schema.createTable('simplefin_discarded_ids', (table) => {
    table.specificType('id', 'CHAR(36)').notNullable().primary();
    table
      .specificType('user_id', 'CHAR(36)')
      .notNullable()
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('sfin_id', 255).notNullable();
    table.timestamp('discarded_at').notNullable().defaultTo(knex.fn.now());
    table.unique(['user_id', 'sfin_id'], { indexName: 'uq_simplefin_discarded_user_sfin' });
    table.index(['user_id'], 'idx_simplefin_discarded_user');
    table.index(['discarded_at'], 'idx_simplefin_discarded_at');
  });

  // 2. Backfill rows from existing discarded_ids_json JSON arrays
  //    JSON_TABLE is available in MariaDB 10.6+ (we run 11.2)
  await knex.raw(`
    INSERT IGNORE INTO simplefin_discarded_ids (id, user_id, sfin_id, discarded_at)
    SELECT UUID(), c.user_id, j.sfin_id, NOW()
    FROM simplefin_connections c,
         JSON_TABLE(
           c.discarded_ids_json,
           '$[*]' COLUMNS (sfin_id VARCHAR(255) PATH '$')
         ) j
    WHERE c.discarded_ids_json IS NOT NULL
      AND c.discarded_ids_json != '[]'
  `);

  // 3. Drop the old JSON blob column
  await knex.schema.alterTable('simplefin_connections', (table) => {
    table.dropColumn('discarded_ids_json');
  });
}

export async function down(knex: Knex): Promise<void> {
  // 1. Restore the JSON column
  await knex.schema.alterTable('simplefin_connections', (table) => {
    table.text('discarded_ids_json').nullable().after('auto_sync_window_end');
  });

  // 2. Backfill JSON column from the normalized table using JSON_ARRAYAGG
  await knex.raw(`
    UPDATE simplefin_connections sc
    SET sc.discarded_ids_json = (
      SELECT JSON_ARRAYAGG(sd.sfin_id)
      FROM simplefin_discarded_ids sd
      WHERE sd.user_id = sc.user_id
    )
    WHERE EXISTS (
      SELECT 1 FROM simplefin_discarded_ids sd WHERE sd.user_id = sc.user_id
    )
  `);

  // 3. Drop the normalized table
  await knex.schema.dropTable('simplefin_discarded_ids');
}
